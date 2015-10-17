package com.sjtu.icare.modules.orders.service;

import java.util.List;

import com.sjtu.icare.modules.orders.entity.OrderEntity;

public interface IOrdersService {

	public List<OrderEntity> getOrderEntities(OrderEntity queryOrderEntity);

	public void updateOrder(OrderEntity postOrderEntity);

	public void insertOrder(OrderEntity postOrderEntity);

}
