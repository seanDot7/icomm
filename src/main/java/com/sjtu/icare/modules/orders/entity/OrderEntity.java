package com.sjtu.icare.modules.orders.entity;


import java.io.Serializable;

import com.sjtu.icare.common.persistence.DataEntity;

/**
 * 老人数据实体类
 * @author WangQi
 * @date 2015-03-05
 */


public class OrderEntity extends DataEntity<OrderEntity> implements Serializable {
  
	private static final long serialVersionUID = 1L;

	private Integer orderId;
	private Integer carerId;
	private Integer elderId;
	private Integer careItemId;
	private String itemName;
	private String itemDetail;
	private Integer orderType;
	private Integer status;
	private String orderTime;
	private Integer rate;
	private String rateDetail;
	private String revisitContent;
	private String callStart;
	private String callEnd;
	private Integer callType;
	private String callDetail;
	private Integer communityId;
	
//	private String userId;
//    private String username;
    
    private String address;
//    private String description;
    private String carerName;
    private String elderName;
    private String communityName;
    private Integer serviceRate;

    private String phoneNumber;
    // Query property
	private String datetimeBefore;

	/**
	 * @return the phoneNumber
	 */
	public String getPhoneNumber() {
		return phoneNumber;
	}

	/**
	 * @param phoneNumber the phoneNumber to set
	 */
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	/**
	 * @return the orderTime
	 */
	public String getOrderTime() {
		return orderTime;
	}

	/**
	 * @param orderTime the orderTime to set
	 */
	public void setOrderTime(String orderTime) {
		this.orderTime = orderTime;
	}

	/**
	 * @return the address
	 */
	public String getAddress() {
		return this.address;
	}

	/**
	 * @param address the address to set
	 */
	public void setAddress(String address) {
		this.address = address;
	}

	/**
	 * @return the carerName
	 */
	public String getCarerName() {
		return carerName;
	}

	/**
	 * @param carerName the carerName to set
	 */
	public void setCarerName(String carerName) {
		this.carerName = carerName;
	}

	/**
	 * @return the orderStatus
	 */
	public Integer getOrderStatus() {
		return status;
	}

	/**
	 * @param orderStatus the orderStatus to set
	 */
	public void setOrderStatus(Integer orderStatus) {
		this.status = orderStatus;
	}

	/**
	 * @return the serviceRate
	 */
	public Integer getServiceRate() {
		return serviceRate;
	}

	/**
	 * @param serviceRate the serviceRate to set
	 */
	public void setServiceRate(Integer serviceRate) {
		this.serviceRate = serviceRate;
	}

	/**
	 * @return the orderType
	 */
	public Integer getOrderType() {
		return orderType;
	}

	/**
	 * @param orderType the orderType to set
	 */
	public void setOrderType(Integer orderType) {
		this.orderType = orderType;
	}

	/**
	 * @return the serialversionuid
	 */
	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	/**
	 * @return the communityId
	 */
	public Integer getCommunityId() {
		return communityId;
	}

	/**
	 * @param communityId the communityId to set
	 */
	public void setCommunityId(Integer communityId) {
		this.communityId = communityId;
	}

	@Override
	public void preDelete() {
		// TODO Auto-generated method stub
		
	}

	/**
	 * @return the datetimeBefore
	 */
	public String getDatetimeBefore() {
		return datetimeBefore;
	}

	/**
	 * @param datetimeBefore the datetimeBefore to set
	 */
	public void setDatetimeBefore(String datetimeBefore) {
		this.datetimeBefore = datetimeBefore;
	}

	/**
	 * @return the elderName
	 */
	public String getElderName() {
		return elderName;
	}

	/**
	 * @param elderName the elderName to set
	 */
	public void setElderName(String elderName) {
		this.elderName = elderName;
	}

	/**
	 * @return the orderId
	 */
	public Integer getOrderId() {
		return orderId;
	}

	/**
	 * @param orderId the orderId to set
	 */
	public void setOrderId(Integer orderId) {
		this.orderId = orderId;
	}

	/**
	 * @return the status
	 */
	public Integer getStatus() {
		return status;
	}

	/**
	 * @param status the status to set
	 */
	public void setStatus(Integer status) {
		this.status = status;
	}

	/**
	 * @return the carerId
	 */
	public Integer getCarerId() {
		return carerId;
	}

	/**
	 * @param carerId the carerId to set
	 */
	public void setCarerId(Integer carerId) {
		this.carerId = carerId;
	}

	/**
	 * @return the elderId
	 */
	public Integer getElderId() {
		return elderId;
	}

	/**
	 * @param elderId the elderId to set
	 */
	public void setElderId(Integer elderId) {
		this.elderId = elderId;
	}

	/**
	 * @return the careItemId
	 */
	public Integer getCareItemId() {
		return careItemId;
	}

	/**
	 * @param careItemId the careItemId to set
	 */
	public void setCareItemId(Integer careItemId) {
		this.careItemId = careItemId;
	}

	/**
	 * @return the itemName
	 */
	public String getItemName() {
		return itemName;
	}

	/**
	 * @param itemName the itemName to set
	 */
	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	/**
	 * @return the itemDetail
	 */
	public String getItemDetail() {
		return itemDetail;
	}

	/**
	 * @param itemDetail the itemDetail to set
	 */
	public void setItemDetail(String itemDetail) {
		this.itemDetail = itemDetail;
	}

	/**
	 * @return the rate
	 */
	public Integer getRate() {
		return rate;
	}

	/**
	 * @param rate the rate to set
	 */
	public void setRate(Integer rate) {
		this.rate = rate;
	}

	/**
	 * @return the rateDetail
	 */
	public String getRateDetail() {
		return rateDetail;
	}

	/**
	 * @param rateDetail the rateDetail to set
	 */
	public void setRateDetail(String rateDetail) {
		this.rateDetail = rateDetail;
	}

	/**
	 * @return the revisitContent
	 */
	public String getRevisitContent() {
		return revisitContent;
	}

	/**
	 * @param revisitContent the revisitContent to set
	 */
	public void setRevisitContent(String revisitContent) {
		this.revisitContent = revisitContent;
	}

	/**
	 * @return the callStart
	 */
	public String getCallStart() {
		return callStart;
	}

	/**
	 * @param callStart the callStart to set
	 */
	public void setCallStart(String callStart) {
		this.callStart = callStart;
	}

	/**
	 * @return the callEnd
	 */
	public String getCallEnd() {
		return callEnd;
	}

	/**
	 * @param callEnd the callEnd to set
	 */
	public void setCallEnd(String callEnd) {
		this.callEnd = callEnd;
	}

	/**
	 * @return the callType
	 */
	public Integer getCallType() {
		return callType;
	}

	/**
	 * @param callType the callType to set
	 */
	public void setCallType(Integer callType) {
		this.callType = callType;
	}

	/**
	 * @return the callDetail
	 */
	public String getCallDetail() {
		return callDetail;
	}

	/**
	 * @param callDetail the callDetail to set
	 */
	public void setCallDetail(String callDetail) {
		this.callDetail = callDetail;
	}

	/**
	 * @return the communityName
	 */
	public String getCommunityName() {
		return communityName;
	}

	/**
	 * @param communityName the communityName to set
	 */
	public void setCommunityName(String communityName) {
		this.communityName = communityName;
	}


}