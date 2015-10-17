package com.sjtu.icare.modules.orders.persistence;

import java.util.List;

import com.sjtu.icare.common.persistence.annotation.MyBatisDao;
import com.sjtu.icare.modules.orders.entity.OrderEntity;

/**
 * @Description 老人数据的 Mapper
 * @author WangQi
 * @date 2015-09-22
 */

@MyBatisDao
public interface OrdersDAO {

	List<OrderEntity> getOrderEntities(OrderEntity queryOrderEntity);

	void updateOrderEntity(OrderEntity postOrderEntity);

	void insertOrderEntity(OrderEntity postOrderEntity);
}