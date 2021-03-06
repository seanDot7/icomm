/**
 * @Package com.sjtu.icare.common.config
 * @Description TODO
 * @date Mar 12, 2015 8:57:23 PM
 * @author Wang Qi
 * @version TODO
 */
package com.sjtu.icare.common.config;

public class CommonConstants {
	
	// USER 表里对应的 user_type
	public static int STAFF_TYPE = 1;
	public static int ELDER_TYPE = 2;	
	public static final int RELATIVE_TYPE = 3;
	public static final String UNSUBSCRIBED = "unsubscribed";
	public static final String SUBSCRIBED_WITHOUT_RELATIONSHIP_BINDING = "subscribed | unbind";
	public static final String SUBSCRIBED_WITH_RELATIONSHIP_BINDING = "subscribed | binded";
	
	public static String DEFAULT_PASSWORD = "ac2e2c80e60060f5d6c5585d21b639e25cf1d938a2c61c3ec0ec5870";
	
	/*
	 * wq:1 - 未处理，2 - 已派单，3 - 已确认，4 - 订单完成并评价，5 - 订单完成未评价，6 - 订单关闭
	 * --状态：
	--0:开始 1:未提交 2:已提交，待确认 3.已确认 4:已派单 5:已完成未评价
	--6: 已评价 7:已取消 8:已关闭（系统取消）
	 */
	public static Integer ORDER_STATUS_SUSPENDING = 1;
	public static Integer ORDER_STATUS_PROCESSED = 2;
	public static Integer ORDER_STATUS_CONFIRMED = 3;
	public static Integer ORDER_STATUS_COMPLETED_UNRATED = 4;
	public static Integer ORDER_STATUS_COMPLETED_RATED = 5;
	public static Integer ORDER_STATUS_FAILED = 6;
	
	public static Integer ORDER_TYPE_CALL_CENTER = 0;
	
}
