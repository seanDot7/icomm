package com.sjtu.icare.modules.orders.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sjtu.icare.modules.orders.entity.OrderEntity;
import com.sjtu.icare.modules.orders.persistence.OrdersDAO;
import com.sjtu.icare.modules.orders.service.IOrdersService;

@Service
@Transactional
public class OrdersService implements IOrdersService {

	@Autowired
	private OrdersDAO ordersDAO;
	
	@Override
	public List<OrderEntity> getOrderEntities(OrderEntity queryOrderEntity) {
		return ordersDAO.getOrderEntities(queryOrderEntity);
	}

	@Override
	public void updateOrder(OrderEntity postOrderEntity) {
		ordersDAO.updateOrderEntity(postOrderEntity);
	}
}
