package com.sjtu.icare.modules.orders.webservice;

import java.awt.TexturePaint;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.log4j.Logger;
import org.apache.xmlbeans.PrePostExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sjtu.icare.common.config.CommonConstants;
import com.sjtu.icare.common.config.ErrorConstants;
import com.sjtu.icare.common.persistence.Page;
import com.sjtu.icare.common.utils.BasicReturnedJson;
import com.sjtu.icare.common.utils.DateUtils;
import com.sjtu.icare.common.utils.MapListUtils;
import com.sjtu.icare.common.utils.ParamUtils;
import com.sjtu.icare.common.utils.PinyinUtils;
import com.sjtu.icare.common.utils.StringUtils;
import com.sjtu.icare.common.web.rest.GeroBaseController;
import com.sjtu.icare.common.web.rest.MediaTypes;
import com.sjtu.icare.common.web.rest.RestException;
import com.sjtu.icare.modules.elder.entity.ElderEntity;
import com.sjtu.icare.modules.elder.entity.ElderRelativeRelationshipEntity;
import com.sjtu.icare.modules.elder.entity.RelativeEntity;
import com.sjtu.icare.modules.elder.service.IElderInfoService;
import com.sjtu.icare.modules.elder.service.IRelativeInfoService;
import com.sjtu.icare.modules.elder.service.impl.ElderInfoService;
import com.sjtu.icare.modules.orders.entity.OrderEntity;
import com.sjtu.icare.modules.orders.service.IOrdersService;
import com.sjtu.icare.modules.sys.entity.User;
import com.sjtu.icare.modules.sys.service.SystemService;

@RestController
@RequestMapping({"${api.web}/orders"})
public class OrdersRestController extends GeroBaseController{
	
	private static Logger logger = Logger.getLogger(OrdersRestController.class);
	
	@Autowired
	private IOrdersService ordersService;
	@Autowired
	private IElderInfoService elderInfoService;
	@Autowired
	private IRelativeInfoService relativeInfoService;
	@Autowired
	private SystemService systemService;
	
	@RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Object getOrders(
			HttpServletRequest request,
			@RequestParam(value="community_id", required=false) Integer communityId,
			@RequestParam(value="order_id", required=false) Integer orderId,
			@RequestParam(value="datetime_before", required=false) String datetimeBefore,
			@RequestParam(value="elder_name", required=false) String elderName,
			@RequestParam(value="phone_number", required=false) String phoneNumber,
			@RequestParam(value="order_status", required=false) Integer orderStatus,
			@RequestParam(value="fuzzy_query_params", required=false) String fuzzyQueryParams,
			@RequestParam("page") int page,
			@RequestParam("rows") int limit,
			@RequestParam("sort") String orderByTag
			) {
		Page<OrderEntity> ordersPage = new Page<OrderEntity>(page, limit);
		ordersPage = setOrderBy(ordersPage, orderByTag);
		
		// 参数检查
		if (StringUtils.isBlank(fuzzyQueryParams))
			fuzzyQueryParams = null;
//		if (gender != null && !(gender.equals("0") || gender.equals("1"))) {
//			String otherMessage = "gender 不符合格式:" +
//					"[gender=" + gender + "]";
//			String message = ErrorConstants.format(ErrorConstants.ELDER_INFO_GET_PARAM_INVALID, otherMessage);
//			logger.error(message);
//			throw new RestException(HttpStatus.BAD_REQUEST, message);
//		}
		
		try {
			// 获取基础的 JSON返回
			BasicReturnedJson basicReturnedJson = new BasicReturnedJson();
			
			OrderEntity queryOrderEntity = new OrderEntity();
			queryOrderEntity.setOrderId(orderId);
			queryOrderEntity.setCommunityId(communityId);
			queryOrderEntity.setOrderStatus(orderStatus);
			queryOrderEntity.setDatetimeBefore(datetimeBefore);
			queryOrderEntity.setElderName(elderName);
			queryOrderEntity.setPhoneNumber(phoneNumber);
			if (fuzzyQueryParams != null) {
				if (!StringUtils.isNumeric(fuzzyQueryParams)) {
					queryOrderEntity.setElderName(fuzzyQueryParams);
				} else {
					queryOrderEntity.setFuzzyQueryParams(fuzzyQueryParams);
				}
				
			}
			
			queryOrderEntity.setPage(ordersPage);
			
			List<OrderEntity> orderEntities;
			orderEntities = ordersService.getOrderEntities(queryOrderEntity);
			
			for (OrderEntity orderEntity : orderEntities) {
				
				Map<String, Object> resultMap = new HashMap<String, Object>(); 
				resultMap.put("order_id", orderEntity.getId());
				resultMap.put("elder_name", orderEntity.getElderName());
				resultMap.put("elder_id", orderEntity.getElderId());
				resultMap.put("phone_no", orderEntity.getPhoneNumber());
				resultMap.put("order_time", orderEntity.getOrderTime());
				resultMap.put("address", orderEntity.getAddress());
				resultMap.put("item_detail", orderEntity.getItemDetail());
				resultMap.put("carer_name", orderEntity.getCarerName());
				resultMap.put("carer_id", orderEntity.getCarerId());
				resultMap.put("order_status", orderEntity.getOrderStatus());
				resultMap.put("rate", orderEntity.getRate());
				resultMap.put("community_id", orderEntity.getCommunityId());
				resultMap.put("item_id", orderEntity.getCareItemId());
				resultMap.put("item_name", orderEntity.getItemName());
				// TODO
//				resultMap.put("operation", orderEntity.getOpe);
				
				basicReturnedJson.addEntity(resultMap);
			}
			
			basicReturnedJson.setTotal((int) queryOrderEntity.getPage().getCount());
			
			return basicReturnedJson.getMap();
			
		} catch(Exception e) {
			String otherMessage = "[" + e.getMessage() + "]";
			String message = ErrorConstants.format(ErrorConstants.ORDERS_GET_SERVICE_FAILED, otherMessage);
			logger.error(message);
			throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, message);
		}
	}
	
	@RequestMapping(value="/{order_id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Object getOrder(
			HttpServletRequest request,
			@PathVariable(value="order_id") Integer orderId
			) {
		
		// TODO 参数检查
		try {
			// 获取基础的 JSON返回
			BasicReturnedJson basicReturnedJson = new BasicReturnedJson();
			
			OrderEntity queryOrderEntity = new OrderEntity();
			queryOrderEntity.setOrderId(orderId);
			
			List<OrderEntity> orderEntities;
			orderEntities = ordersService.getOrderEntities(queryOrderEntity);
			
			if (orderEntities.size() == 1) {
				OrderEntity orderEntity = orderEntities.get(0);
				Map<String, Object> resultMap = new HashMap<String, Object>(); 
				resultMap.put("order_id", orderEntity.getId());
				resultMap.put("elder_name", orderEntity.getElderName());
				resultMap.put("elder_id", orderEntity.getElderId());
				resultMap.put("phone_no", orderEntity.getPhoneNumber());
				resultMap.put("order_time", orderEntity.getOrderTime());
				resultMap.put("address", orderEntity.getAddress());
				resultMap.put("item_detail", orderEntity.getItemDetail());
				resultMap.put("carer_name", orderEntity.getCarerName());
				resultMap.put("carer_id", orderEntity.getCarerId());
				resultMap.put("order_status", orderEntity.getOrderStatus());
				resultMap.put("rate", orderEntity.getRate());
				resultMap.put("community_id", orderEntity.getCommunityId());
				resultMap.put("item_id", orderEntity.getCareItemId());
				resultMap.put("item_name", orderEntity.getItemName());
				
				basicReturnedJson.addEntity(resultMap);
			}
			
			basicReturnedJson.setTotal((int) queryOrderEntity.getPage().getCount());
			
			return basicReturnedJson.getMap();
			
		} catch(Exception e) {
			String otherMessage = "[" + e.getMessage() + "]";
			String message = ErrorConstants.format(ErrorConstants.ORDERS_GET_SERVICE_FAILED, otherMessage);
			logger.error(message);
			throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, message);
		}
	}
	
	@RequestMapping(value="/{orderId}/carers", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Object getElders(
			HttpServletRequest request,
			@RequestParam(value="community_id", required=false) Integer communityId,
			@RequestParam(value="order_id", required=false) Integer orderId,
			@RequestParam(value="datetime_before", required=false) String datetimeBefore,
			@RequestParam(value="elder_name", required=false) String elderName,
			@RequestParam(value="phone_number", required=false) String phoneNumber,
			@RequestParam(value="order_status", required=false) Integer orderStatus,
			@RequestParam(value="fuzzy_query_params", required=false) String fuzzyQueryParams,
			@RequestParam("page") int page,
			@RequestParam("rows") int limit,
			@RequestParam("sort") String orderByTag
			) {
		Page<OrderEntity> ordersPage = new Page<OrderEntity>(page, limit);
		ordersPage = setOrderBy(ordersPage, orderByTag);
		
		// 参数检查
		if (StringUtils.isBlank(fuzzyQueryParams))
			fuzzyQueryParams = null;
//		if (gender != null && !(gender.equals("0") || gender.equals("1"))) {
//			String otherMessage = "gender 不符合格式:" +
//					"[gender=" + gender + "]";
//			String message = ErrorConstants.format(ErrorConstants.ELDER_INFO_GET_PARAM_INVALID, otherMessage);
//			logger.error(message);
//			throw new RestException(HttpStatus.BAD_REQUEST, message);
//		}
		
		try {
			// 获取基础的 JSON返回
			BasicReturnedJson basicReturnedJson = new BasicReturnedJson();
			
			OrderEntity queryOrderEntity = new OrderEntity();
			queryOrderEntity.setOrderId(orderId);
			queryOrderEntity.setCommunityId(communityId);
			queryOrderEntity.setOrderStatus(orderStatus);
			queryOrderEntity.setDatetimeBefore(datetimeBefore);
			queryOrderEntity.setElderName(elderName);
			queryOrderEntity.setPhoneNumber(phoneNumber);
			if (fuzzyQueryParams != null) {
				if (!StringUtils.isNumeric(fuzzyQueryParams)) {
					queryOrderEntity.setElderName(fuzzyQueryParams);
				} else {
					queryOrderEntity.setFuzzyQueryParams(fuzzyQueryParams);
				}
				
			}
			
			queryOrderEntity.setPage(ordersPage);
			
			List<OrderEntity> orderEntities;
			orderEntities = ordersService.getOrderEntities(queryOrderEntity);
			
			for (OrderEntity orderEntity : orderEntities) {
				
				Map<String, Object> resultMap = new HashMap<String, Object>(); 
				resultMap.put("order_id", orderEntity.getId());
				resultMap.put("elder_name", orderEntity.getElderName());
				resultMap.put("elder_id", orderEntity.getElderId());
				resultMap.put("phone_no", orderEntity.getPhoneNumber());
				resultMap.put("order_time", orderEntity.getOrderTime());
				resultMap.put("address", orderEntity.getAddress());
				resultMap.put("item_detail", orderEntity.getItemDetail());
				resultMap.put("carer_name", orderEntity.getCarerName());
				resultMap.put("carer_id", orderEntity.getCarerId());
				resultMap.put("order_status", orderEntity.getOrderStatus());
				resultMap.put("community_id", orderEntity.getCommunityId());
				// TODO
//				resultMap.put("operation", orderEntity.getOpe);
				
				basicReturnedJson.addEntity(resultMap);
			}
			
			basicReturnedJson.setTotal((int) queryOrderEntity.getPage().getCount());
			
			return basicReturnedJson.getMap();
			
		} catch(Exception e) {
			String otherMessage = "[" + e.getMessage() + "]";
			String message = ErrorConstants.format(ErrorConstants.ORDERS_GET_SERVICE_FAILED, otherMessage);
			logger.error(message);
			throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, message);
		}
	}
	
	@Transactional
	@RequestMapping(method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Object postElder(
			HttpServletRequest request,
			@RequestBody String inJson
			) {
//		checkApi(request);
//		List<String> permissions = new ArrayList<String>();
//		permissions.add("admin:gero:"+geroId+":elder:info:add");
//		checkPermissions(permissions);
		
		// 将参数转化成驼峰格式的 Map
		Map<String, Object> tempRquestParamMap = ParamUtils.getMapByJson(inJson, logger);
		Map<String, Object> requestParamMap = MapListUtils.convertMapToCamelStyle(tempRquestParamMap);
		requestParamMap.put("orderTime", DateUtils.getDateTime());
		boolean newElderFlag = false;
		boolean newRelativeFlag = false;
		if (requestParamMap.get("elderId") == null){
			newElderFlag = true;
		}
		if (requestParamMap.get("relativeId") == null){
			newRelativeFlag = true;
		}
		try {
			if (requestParamMap.get("careItemId") == null) {
				throw new Exception();
			}
			System.out.println(requestParamMap.get("elderId") );
			
			if(requestParamMap.get("elderName") == null || requestParamMap.get("elderPhoneNumber") == null || requestParamMap.get("communityId") == null){
				
				throw new Exception("老人姓名和老人电话号码是必须字段");
			}
				
//			if (requestParamMap.get("elderId") != null) {
//				postElderEntity = elderInfoService.getElderEntityByIdentityNo((String) requestParamMap.get("elderId"));
//				if (postElderEntity == null)
//					throw new Exception("没有查找到elderId对应的老人信息")；
//			}
			
			if (requestParamMap.get("relativeName") == null || requestParamMap.get("relativePhoneNumber") == null) {
				
				throw new Exception();
			}
			
//			if (requestParamMap.get("relativeId") != null) {
//				RelativeEntity queryRelativeEntity = new RelativeEntity();
//				queryRelativeEntity.setId((Integer) requestParamMap.get("relativeId"));
//				postElderEntity = relativeInfoService.getRelative(queryRelativeEntity);
//				if (postElderEntity == null)
//					throw new Exception("没有查找到elderId对应的老人信息")；
//			}
			// 参数详细验证
			
			// birthday
			// TODO
		} catch(Exception e) {
			String otherMessage = "[" + inJson + "]";
			String message = ErrorConstants.format(ErrorConstants.ORDERS_INFO_POST_PARAM_INVALID, otherMessage);
			logger.error(message);
			throw new RestException(HttpStatus.BAD_REQUEST, message);
		}
		
		// 获取基础的 JSON
		BasicReturnedJson basicReturnedJson = new BasicReturnedJson();
		
		// 插入数据
		try {
			
			ElderEntity postElderEntity = null;
			User postElderUser = null;
			RelativeEntity postRelativeEntity = null;
			User postRelativeUser = null;
			
			Integer elderId = null;
			Integer elderUserId = null;
			Integer relativeId = null;
			Integer relativeUserId = null;
			
			String elderName = (String) requestParamMap.get("elderName");
			String elderPhoneNumber = (String) requestParamMap.get("elderPhoneNumber");
			String relativeName = (String) requestParamMap.get("relativeName");
			String relativePhoneNumber = (String) requestParamMap.get("relativePhoneNumber");
			Integer careItemId = (Integer) requestParamMap.get("careItemId");
			if(newElderFlag == true && newRelativeFlag == false){
				throw new Exception("参数错误");
			}
			if (newElderFlag) {
				// Add elder
				postElderEntity = new ElderEntity(); 
				postElderEntity.setName(elderName);
				postElderEntity.setGeroId((Integer)requestParamMap.get("communityId"));
				elderId = elderInfoService.insertElder(postElderEntity);
				
				// insert into User
				requestParamMap.put("userType", CommonConstants.ELDER_TYPE);
				requestParamMap.put("userId", elderId);
				
				postElderUser = new User(); 
				postElderUser.setName(elderName);
				postElderUser.setPhoneNo(elderPhoneNumber);
				postElderUser.setUsername(postElderUser.getPhoneNo());
				postElderUser.setUserType(CommonConstants.ELDER_TYPE);
				postElderUser.setUserId(elderId);
				postElderUser.setGeroId((Integer)requestParamMap.get("communityId"));
				postElderUser.setResidenceAddress((String) requestParamMap.get("address"));
				postElderUser.setPassword(CommonConstants.DEFAULT_PASSWORD);
				postElderUser.setRegisterDate(DateUtils.getDateTime());
				elderUserId = systemService.insertUser(postElderUser);
				String pinyinName = PinyinUtils.getPinyin(postElderUser.getName() + elderUserId);
				postElderUser.setUsername(pinyinName);
				systemService.updateUser(postElderUser);
			} else {
				elderUserId = (Integer) requestParamMap.get("elderId");
				User queryUser = new User();
				queryUser.setId(elderUserId);
				postElderUser = systemService.getUser(elderUserId);
				if (postElderUser == null) {
					throw new Exception("找不到对应的 user");
				}
				elderId = postElderUser.getUserId();
				
				ElderEntity queryElderEntity = new ElderEntity();
				queryElderEntity.setId(elderId);
				postElderEntity = elderInfoService.getElderEntity(queryElderEntity);
				if (postElderEntity == null) {
					throw new Exception("找不到对应的 elder");
				}
				
			}
			
			if (newRelativeFlag) {
				// Add relative
				postRelativeEntity = new RelativeEntity(); 
				postRelativeEntity.setName(relativeName);
				postRelativeEntity.setElderId(elderId);
				relativeId = relativeInfoService.insertRelative(postRelativeEntity);
				
				requestParamMap.put("userType", CommonConstants.RELATIVE_TYPE);
				requestParamMap.put("userId", relativeId);
				
				postRelativeUser = new User();
				postRelativeUser.setUsername(relativePhoneNumber);
				postRelativeUser.setName(relativeName);
				postRelativeUser.setPhoneNo(relativePhoneNumber);
				postRelativeUser.setUserType(CommonConstants.RELATIVE_TYPE);
				postRelativeUser.setUserId(relativeId);
				postRelativeUser.setElderId(elderUserId);
				postRelativeUser.setPassword(CommonConstants.DEFAULT_PASSWORD);
				postRelativeUser.setRegisterDate(DateUtils.getDateTime());
				relativeUserId = systemService.insertUser(postRelativeUser);
				String pinyinName = PinyinUtils.getPinyin(postRelativeUser.getName() + relativeUserId);
				postRelativeUser.setUsername(pinyinName);
				systemService.updateUser(postRelativeUser);
				// Bind relationship
				ElderRelativeRelationshipEntity elderRelativeRelationshipEntity = new ElderRelativeRelationshipEntity();
				elderRelativeRelationshipEntity.setElderUserId(elderUserId);
				elderRelativeRelationshipEntity.setRelativeUserId(relativeUserId);
				relativeInfoService.insertElderRelativeRelationship(elderRelativeRelationshipEntity);
			} else {
				relativeUserId = (Integer) requestParamMap.get("relativeId");
				RelativeEntity queryRelativeEntity = new RelativeEntity();
				queryRelativeEntity.setId(relativeId);
				postRelativeUser = systemService.getUser(relativeUserId);
				if (postRelativeUser == null) {
					throw new Exception("找不到对应的 user");
				}
				relativeId = postRelativeUser.getUserId();
				
				queryRelativeEntity.setId(relativeId);
				
				postRelativeEntity =  relativeInfoService.getRelative(queryRelativeEntity);
				if (postRelativeEntity == null) {
					throw new Exception("找不到对应的 relative");
				}
				
				
			}
			// Add order
			OrderEntity postOrderEntity = new OrderEntity();
			
			BeanUtils.populate(postOrderEntity, requestParamMap);
			postOrderEntity.setElderId(postElderUser.getId());
			postOrderEntity.setCareItemId(careItemId);
			postOrderEntity.setStatus(1);
			ordersService.insertOrder(postOrderEntity);
			
		} catch(Exception e) {
			String otherMessage = "[" + e.getMessage() + "]";
			String message = ErrorConstants.format(ErrorConstants.ORDERS_POST_SERVICE_FAILED, otherMessage);
			logger.error(message);
			throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, message);
		}

		return basicReturnedJson.getMap();
		
	}
//	
//	@RequestMapping(value="/{eid}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
//	public Object getElder(
//			HttpServletRequest request,
//			@PathVariable("gid") int geroId,
//			@PathVariable("eid") int elderId
//			) {
////		checkApi(request);
////		List<String> permissions = new ArrayList<String>();
////		permissions.add("admin:gero:"+geroId+":elder:info:read");
////		permissions.add("staff:"+getCurrentUser().getUserId()+":gero:"+geroId+":elder:read");
//		
//		
//		try {
//			// 获取基础的 JSON返回
//			BasicReturnedJson basicReturnedJson = new BasicReturnedJson();
//			
//			ElderEntity queryElderEntity = new ElderEntity();
//			queryElderEntity.setId(elderId);
//			ElderEntity elderEntity = elderInfoService.getElderEntity(queryElderEntity);
//			if (elderEntity == null)
//				throw new Exception("找不到对应的 elder");
//			User user = systemService.getUserByUserTypeAndUserId(CommonConstants.ELDER_TYPE, elderId);
//			if (user == null)
//				throw new Exception("内部错误：找不到对应的 user");
//			
////			permissions.add("user:"+user.getId()+":info:read");
////			checkPermissions(permissions);
//			
//			Map<String, Object> resultMap = new HashMap<String, Object>(); 
//			resultMap.put("elder_id", user.getUserId()); 
//			resultMap.put("id", user.getId()); 
//			
//			resultMap.put("age", user.getAge()); 
//			resultMap.put("birthday", user.getBirthday()); 
//			resultMap.put("cancel_date", user.getCancelDate()); 
//			resultMap.put("education", user.getEducation()); 
//			resultMap.put("email", user.getEmail()); 
//			resultMap.put("gender", user.getGender()); 
//			resultMap.put("gero_id", user.getGeroId()); 
//			resultMap.put("household_address", user.getHouseholdAddress()); 
//			resultMap.put("identity_no", user.getIdentityNo()); 
//			resultMap.put("marriage", user.getMarriage()); 
//			resultMap.put("name", user.getName()); 
//			resultMap.put("nationality", user.getNationality()); 
//			resultMap.put("native_place", user.getNativePlace()); 
//			resultMap.put("notes", user.getNotes()); 
//			resultMap.put("phone_no", user.getPhoneNo()); 
//			resultMap.put("photo_url", user.getPhotoUrl()); 
//			resultMap.put("political_status", user.getPoliticalStatus()); 
//			resultMap.put("register_date", user.getRegisterDate()); 
//			resultMap.put("residence_address", user.getResidenceAddress()); 
//			resultMap.put("username", user.getUsername()); 
//			resultMap.put("user_type", user.getUserType()); 
//			resultMap.put("wechat_id", user.getWechatId()); 
//			resultMap.put("zip_code", user.getZipCode()); 
//			
//			resultMap.put("photo_src", user.getPhotoSrc()); 
//			
//			resultMap.put("apply_url", elderEntity.getApplyUrl()); 
//			
//			resultMap.put("area_id", elderEntity.getAreaId());
//			GeroAreaEntity requestGeroAreaEntity = new GeroAreaEntity();
//			requestGeroAreaEntity.setGeroId(geroId);
//			requestGeroAreaEntity.setId(elderEntity.getAreaId());
//			GeroAreaEntity geroAreaEntity = geroAreaService.getGeroArea(requestGeroAreaEntity);
//			
//			resultMap.put("area_fullname", geroAreaEntity.getFullName());
//			
//			resultMap.put("assess_url", elderEntity.getAssessUrl());
//			resultMap.put("archive_id", elderEntity.getArchiveId());
//			resultMap.put("care_level", elderEntity.getCareLevel()); 
//			resultMap.put("checkin_date", elderEntity.getCheckinDate()); 
//			resultMap.put("checkout_date", elderEntity.getCheckoutDate());
//			resultMap.put("nssf_id", elderEntity.getNssfId()); 
//			resultMap.put("pad_mac", elderEntity.getPadMac()); 
//			resultMap.put("survey_url", elderEntity.getSurveyUrl()); 
//			resultMap.put("track_url", elderEntity.getTrackUrl()); 
//			
//			basicReturnedJson.addEntity(resultMap);
//			
//			return basicReturnedJson.getMap();
//			
//		} catch(Exception e) {
//			String otherMessage = "[" + e.getMessage() + "]";
//			String message = ErrorConstants.format(ErrorConstants.ELDER_INFO_ELDER_GET_SERVICE_FAILED, otherMessage);
//			logger.error(message);
//			throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, message);
//		}
//		
//		
//	}
//	
	@Transactional
	@RequestMapping(value="/{order_id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Object putElder(
			HttpServletRequest request,
			@PathVariable("order_id") Integer orderId,
			@RequestBody String inJson
			) {
//		checkApi(request);
//		List<String> permissions = new ArrayList<String>();
//		permissions.add("admin:gero:"+geroId+":elder:info:update");
		
		// 将参数转化成驼峰格式的 Map
		Map<String, Object> tempRquestParamMap = ParamUtils.getMapByJson(inJson, logger);
		tempRquestParamMap.put("id", orderId);
		tempRquestParamMap.put("orderId", orderId);
		Map<String, Object> requestParamMap = MapListUtils.convertMapToCamelStyle(tempRquestParamMap);
		
		Integer status = (Integer)requestParamMap.get("status");
		Integer careItemId = (Integer)requestParamMap.get("careItemId");
		try {
			// TODO 参数详细验证
			if (status >= 2 && careItemId <= 0)
				throw new Exception("护理项目未选择");

		} catch(Exception e) {
			String otherMessage = "[" + inJson + "]";
			String message = ErrorConstants.format(ErrorConstants.ORDERS_PUT_PARAM_FAILED, otherMessage);
			logger.error(message);
			throw new RestException(HttpStatus.BAD_REQUEST, message);
		}
		
		
		// 获取基础的 JSON
		BasicReturnedJson basicReturnedJson = new BasicReturnedJson();
		
		// 插入数据
		try {
			OrderEntity postOrderEntity = new OrderEntity(); 
			BeanUtils.populate(postOrderEntity, requestParamMap);
			postOrderEntity.setOrderId(orderId);
			postOrderEntity.setId(orderId);
			postOrderEntity.setElderId(null);
			postOrderEntity.setOrderTime(null);
			// 只有派单时可以修改项目
			if (postOrderEntity.getStatus() != 2 || postOrderEntity.getStatus() != 1) {
				postOrderEntity.setCareItemId(null);
				postOrderEntity.setCarerId(null);
			}
			if (postOrderEntity.getStatus() != 5) {
				postOrderEntity.setRate(null);
			}
			
			ordersService.updateOrder(postOrderEntity);
			
		} catch(Exception e) {
			String otherMessage = "[" + e.getMessage() + "]";
			String message = ErrorConstants.format(ErrorConstants.ORDERS_PUT_SERVICE_FAILED, otherMessage);
			logger.error(message);
			throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, message);
		}

		return basicReturnedJson.getMap();
		
	}
//	
//	@Transactional
//	@RequestMapping(value="/{eid}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
//	public Object deleteELder(
//			HttpServletRequest request,
//			@PathVariable("gid") int geroId,
//			@PathVariable("eid") int elderId
//			) {
////		checkApi(request);
////		List<String> permissions = new ArrayList<String>();
////		permissions.add("admin:gero:"+geroId+":elder:info:add");
////		checkPermissions(permissions);
//		
//		// 将参数转化成驼峰格式的 Map
//		Map<String, Object> requestParamMap = new HashMap<String, Object>();
//		requestParamMap.put("geroId", geroId);
//		requestParamMap.put("elderId", elderId);
//		
//		// 获取基础的 JSON
//		BasicReturnedJson basicReturnedJson = new BasicReturnedJson();
//		
//		// 插入数据
//		try {
//			Date now = new Date();
//			
//			String nowDateTime =  DateUtils.formatDateTime(now);
//			String nowDate =  DateUtils.formatDate(now);
//			
//			// delete Elder
//			ElderEntity postElderEntity = new ElderEntity(); 
//			BeanUtils.populate(postElderEntity, requestParamMap);
//			postElderEntity.setId(elderId);
//			postElderEntity.setCheckoutDate(nowDate);
//			elderInfoService.deleteElder(postElderEntity);
//			
//			// delete USER
//			requestParamMap.put("userType", CommonConstants.ELDER_TYPE);
//			requestParamMap.put("userId", elderId);
//			User tempUser = systemService.getUserByUserTypeAndUserId(CommonConstants.ELDER_TYPE, elderId);
//			User postUser = new User(); 
//			BeanUtils.populate(postUser, requestParamMap);
//			postUser.setId(tempUser.getId());
//			postUser.setCancelDate(nowDateTime);
//			systemService.deleteUser(postUser);
//			
//		} catch(Exception e) {
//			String otherMessage = "[" + e.getMessage() + "]";
//			String message = ErrorConstants.format(ErrorConstants.ELDER_INFO_ELDER_DELETE_SERVICE_FAILED, otherMessage);
//			logger.error(message);
//			throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, message);
//		}
//
//		return basicReturnedJson.getMap();
//		
//	}
	
}
