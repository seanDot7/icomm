USE [COMMUNITY]
;

-- 建立默认街道

INSERT INTO [dbo].[T_GERO]([name],[city],[district],[register_date])
     VALUES('default','default','default','2015-09-14')
;

-- 建立权限表

INSERT INTO COMMUNITY.dbo.T_PRIVILEGE (name,parent_id,parent_ids,permission,api,href,icon,notes) VALUES (
'首页',0,'0,','','','','','');
INSERT INTO COMMUNITY.dbo.T_PRIVILEGE (name,parent_id,parent_ids,permission,api,href,icon,notes) VALUES (
'权限管理（超管）',1,'0,1,','','','/superp','','');
INSERT INTO COMMUNITY.dbo.T_PRIVILEGE (name,parent_id,parent_ids,permission,api,href,icon,notes) VALUES (
'老人列表',1,'0,1,','','','/gero/1/elder','','');
INSERT INTO COMMUNITY.dbo.T_PRIVILEGE (name,parent_id,parent_ids,permission,api,href,icon,notes) VALUES (
'小区列表',1,'0,1,','','','/area','','');
INSERT INTO COMMUNITY.dbo.T_PRIVILEGE (name,parent_id,parent_ids,permission,api,href,icon,notes) VALUES (
'项目列表',1,'0,1,','','','/gero/1/care_item','','');
INSERT INTO COMMUNITY.dbo.T_PRIVILEGE (name,parent_id,parent_ids,permission,api,href,icon,notes) VALUES (
'角色列表',1,'0,1,','','','/gero/1/role','','');
INSERT INTO COMMUNITY.dbo.T_PRIVILEGE (name,parent_id,parent_ids,permission,api,href,icon,notes) VALUES (
'职工列表',1,'0,1,','','','/gero/1/staff','','');
INSERT INTO COMMUNITY.dbo.T_PRIVILEGE (name,parent_id,parent_ids,permission,api,href,icon,notes) VALUES (
'家属列表',1,'0,1,','','','/relative',NULL,NULL);
INSERT INTO COMMUNITY.dbo.T_PRIVILEGE (name,parent_id,parent_ids,permission,api,href,icon,notes) VALUES (
'订单列表',1,'0,1,','','','/order',NULL,NULL);

---------------------------------------------------------------------------------------

-- 建立街道中的小区

INSERT INTO [dbo].[T_AREA]
           ([parent_id]
           ,[parent_ids]
           ,[gero_id]
           ,[type]
           ,[level]
           ,[name]
           ,[full_name])
     VALUES
           (0
           ,'0,'
           ,1
           ,1
           ,1
           ,'1号小区'
           ,'1号小区,')
;

---------------------------------------------------------------------------------------

-- 生成默认项目

INSERT INTO COMMUNITY.dbo.T_CARE_ITEM (gero_id,name,del_flag) VALUES (
1,'护理','0');
INSERT INTO COMMUNITY.dbo.T_CARE_ITEM (gero_id,name,del_flag) VALUES (
1,'剃头','0');
INSERT INTO COMMUNITY.dbo.T_CARE_ITEM (gero_id,name,del_flag) VALUES (
1,'做饭','0');

---------------------------------------------------------------------------------------

-- 生成超管角色

INSERT INTO [dbo].[T_ROLE]
           ([name]
           ,[notes]
		   ,[gero_id])
     VALUES
           ('超级管理员'
           ,'系统超级管理员'
		   ,'1')
;

---------------------------------------------------------------------------------------

-- 生成街道默认角色


INSERT INTO [dbo].[T_ROLE]
           ([name]
           ,[notes]
		   ,[gero_id])
     VALUES
           ('管理员'
           ,'管理员'
		   ,'1')
;

INSERT INTO [dbo].[T_ROLE]
           ([name]
           ,[notes]
		   ,[gero_id])
     VALUES
           ('护工'
           ,'护工'
		   ,'1')
;

INSERT INTO [dbo].[T_ROLE]
           ([name]
           ,[notes]
		   ,[gero_id])
     VALUES
           ('接线员'
           ,'接线员'
		   ,'1')
;

INSERT INTO [dbo].[T_ROLE]
           ([name]
           ,[notes]
		   ,[gero_id])
     VALUES
           ('老人'
           ,'老人'
		   ,'1')
;

INSERT INTO [dbo].[T_ROLE]
           ([name]
           ,[notes]
		   ,[gero_id])
     VALUES
           ('家属'
           ,'家属'
		   ,'1')
;

---------------------------------------------------------------------------------------

-- 给默认角色赋予默认权限

-- 超管

INSERT INTO COMMUNITY.dbo.T_ROLE_PRIVILEGES (role_id,privilege_id) VALUES (
1,1);
INSERT INTO COMMUNITY.dbo.T_ROLE_PRIVILEGES (role_id,privilege_id) VALUES (
1,2);
INSERT INTO COMMUNITY.dbo.T_ROLE_PRIVILEGES (role_id,privilege_id) VALUES (
1,3);
INSERT INTO COMMUNITY.dbo.T_ROLE_PRIVILEGES (role_id,privilege_id) VALUES (
1,4);
INSERT INTO COMMUNITY.dbo.T_ROLE_PRIVILEGES (role_id,privilege_id) VALUES (
1,5);
INSERT INTO COMMUNITY.dbo.T_ROLE_PRIVILEGES (role_id,privilege_id) VALUES (
1,6);
INSERT INTO COMMUNITY.dbo.T_ROLE_PRIVILEGES (role_id,privilege_id) VALUES (
1,7);
INSERT INTO COMMUNITY.dbo.T_ROLE_PRIVILEGES (role_id,privilege_id) VALUES (
1,8);


-- 管理员
INSERT INTO COMMUNITY.dbo.T_ROLE_PRIVILEGES (role_id,privilege_id) VALUES (
2,1);
INSERT INTO COMMUNITY.dbo.T_ROLE_PRIVILEGES (role_id,privilege_id) VALUES (
2,2);
INSERT INTO COMMUNITY.dbo.T_ROLE_PRIVILEGES (role_id,privilege_id) VALUES (
2,3);
INSERT INTO COMMUNITY.dbo.T_ROLE_PRIVILEGES (role_id,privilege_id) VALUES (
2,4);
INSERT INTO COMMUNITY.dbo.T_ROLE_PRIVILEGES (role_id,privilege_id) VALUES (
2,5);
INSERT INTO COMMUNITY.dbo.T_ROLE_PRIVILEGES (role_id,privilege_id) VALUES (
2,6);
INSERT INTO COMMUNITY.dbo.T_ROLE_PRIVILEGES (role_id,privilege_id) VALUES (
2,7);
INSERT INTO COMMUNITY.dbo.T_ROLE_PRIVILEGES (role_id,privilege_id) VALUES (
2,8);

---------------------------------------------------------------------------------------

-- 生成超级管理员

INSERT INTO [dbo].[T_USER]([username],[name],[password],[user_type],[user_id],[register_date],[identity_no],[birthday],[phone_no],[gero_id])
     VALUES('su','超级管理员','02a3f0772fcca9f415adc990734b45c6f059c7d33ee28362c4852032','0','0','2015-03-05 00:00:00.000','1','1970-01-01','18888888888','1')
;

---------------------------------------------------------------------------------------

-- 生成默认街道管理员

INSERT INTO [dbo].[T_USER]([username],[name],[password],[user_type],[user_id],[register_date],[identity_no],[birthday],[phone_no],[gero_id])
     VALUES('default_admin','默认管理员','02a3f0772fcca9f415adc990734b45c6f059c7d33ee28362c4852032','1','1','2015-03-05 00:00:00.000','1','1970-01-01','18888888888','1')
;

INSERT INTO [dbo].[T_STAFF]([name],[gero_id])
     VALUES('默认管理员',1)
;

---------------------------------------------------------------------------------------

-- 生成默认街道护工


INSERT INTO [dbo].[T_USER]([username],[name],[password],[user_type],[user_id],[register_date],[identity_no],[birthday],[phone_no],[gero_id])
     VALUES('default_carer','默认护工','02a3f0772fcca9f415adc990734b45c6f059c7d33ee28362c4852032','1','2','2015-03-05 00:00:00.000','1','1970-01-01','18888888888','1')
;

INSERT INTO [dbo].[T_STAFF]([name],[gero_id])
     VALUES('默认护工',1)
;

-- 生成默认接线员

INSERT INTO [dbo].[T_USER]([username],[name],[password],[user_type],[user_id],[register_date],[identity_no],[birthday],[phone_no],[gero_id])
     VALUES('default_doctor','默认接线员','02a3f0772fcca9f415adc990734b45c6f059c7d33ee28362c4852032','1','3','2015-03-05 00:00:00.000','1','1970-01-01','18888888888','1')
;

INSERT INTO [dbo].[T_STAFF]([name],[gero_id])
     VALUES('默认接线员',1)
;

---------------------------------------------------------------------------------------

-- 生成街道默认老人、家属

-- 生成默认老人

INSERT INTO [dbo].[T_USER]([username],[name],[password],[user_type],[user_id],[register_date],[identity_no],[birthday],[phone_no],[gero_id])
     VALUES('default_elder','默认老人','02a3f0772fcca9f415adc990734b45c6f059c7d33ee28362c4852032','2','1','2015-03-05 00:00:00.000','1','1970-01-01','18888888888','1')
;

INSERT INTO [dbo].[T_ELDER]([name],[gero_id],[area_id])
     VALUES('默认老人',1,1)
;

-- 生成默认家属

INSERT INTO [dbo].[T_USER]([username],[name],[password],[user_type],[user_id],[register_date],[identity_no],[birthday],[phone_no],[gero_id])
     VALUES('default_relative','默认家属','02a3f0772fcca9f415adc990734b45c6f059c7d33ee28362c4852032','3','1','2015-03-05 00:00:00.000','1','1970-01-01','18888888888','1')
;

INSERT INTO [dbo].[T_ELDER_RELATIVE]([name])
     VALUES('默认家属')
;

---------------------------------------------------------------------------------------

-- 为用户赋予角色

INSERT INTO [dbo].[T_USER_ROLES]
           ([user_id]
           ,[role_id])
     VALUES
           ('1'
           ,'1'
		   )
;

INSERT INTO [dbo].[T_USER_ROLES]
           ([user_id]
           ,[role_id])
     VALUES
           ('2'
           ,'2'
		   )
;

INSERT INTO [dbo].[T_USER_ROLES]
           ([user_id]
           ,[role_id])
     VALUES
           ('3'
           ,'3'
		   )
;

INSERT INTO [dbo].[T_USER_ROLES]
           ([user_id]
           ,[role_id])
     VALUES
           ('4'
           ,'4'
		   )
;

INSERT INTO [dbo].[T_USER_ROLES]
           ([user_id]
           ,[role_id])
     VALUES
           ('5'
           ,'5'
		   )
;

INSERT INTO [dbo].[T_USER_ROLES]
           ([user_id]
           ,[role_id])
     VALUES
           ('6'
           ,'6'
		   )
;
