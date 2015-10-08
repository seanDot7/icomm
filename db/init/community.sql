
--本数据库文档系经icare养老院项目数据库迁移而来，做了修改

EXEC msdb.dbo.sp_delete_database_backuphistory @database_name = N'COMMUNITY'
;
USE [master]
;
ALTER DATABASE [COMMUNITY] SET  SINGLE_USER WITH ROLLBACK IMMEDIATE
;
USE [master]
;
/****** Object:  Database [COMMUNITY]    Script Date: 2015/3/13 11:00:40 ******/
DROP DATABASE [COMMUNITY]
;


CREATE DATABASE COMMUNITY
;

USE COMMUNITY
;

CREATE TABLE T_USER
(
	id					int				PRIMARY KEY IDENTITY,	--用户id
	username			nvarchar(30)	NOT NULL	UNIQUE,		--用户登录名
	name				nvarchar(20)	NOT NULL,				--用户姓名
	password			varchar(64)		NOT NULL,				--用户密码
	user_type			int				NOT NULL,				--超级管理员=0、管理员=1，员工=2、老人=3、家属=4
	user_id				int				NOT NULL,				-- -1，gero_id, staff_id, elder_id，relative_id
	register_date		datetime		NOT NULL,				--注册日期
	cancel_date			datetime		,						--注销日期
	gender				char(1)			,						--性别（男0，女1）
	photo_url			varchar(256)	,						--照片url
	identity_no			char(18)		,						--身份证号码
	age					int				,						--年龄
	nationality			nvarchar(20)	,						--民族
	marriage			int				,						--0:未婚  1：已婚 2：离异 3:丧偶
	native_place		nvarchar(20)	,						--籍贯
	birthday			date			,						--出生年月日
	political_status	nvarchar(10)	,						--政治面貌
	education			nvarchar(50)	,						--受教育水平
	phone_no			char(20)		,						--联系方式
	zip_code			char(10)		,						--邮编	
	residence_address	nvarchar(50)	,						--户籍地址
	household_address	nvarchar(50)	,						--居住地址
	email				varchar(20)		,						--邮箱地址
	wechat_id			varchar(32)		,						--微信账号(open_id)
	gero_id				int				,						--街道id，关联GERO
	union_id			varchar(32)		,						--微信用户id（跨应用，见微信api）
	subscribe			char(1)			,						--是否关注，取关后为0
	subscribe_time		datetime		,						--用户关注时间
	
	CONSTRAINT uc_UserID UNIQUE (user_type,user_id)
)
;

CREATE TABLE T_GERO
(
	id					int				PRIMARY KEY IDENTITY,	--街道id
	name				nvarchar(50)	NOT NULL,				--街道名称
	city				nvarchar(10)	NOT NULL,				--所在城市
	district			nvarchar(10)	NOT NULL,				--所在行政区
	address				nvarchar(30)	,						--所在地址
	contact				varchar(20)		,						--联系方式，座机或者手机
	licence				varchar(30)		,						--许可证
	scale				int				,						--街道人数
	care_level			int				,						--街道能提供的最高的护理等级
	contact_id			int				,						--街道联系人id，关联staff表
	logo_url			varchar(256)	,						--街道logo图片的url地址
	photo_url			varchar(256)	,						--街道封面图片的url地址
	register_date		datetime		NOT NULL,				--注册日期
	cancel_date			datetime		,						--注销日期
)
;

CREATE TABLE T_AREA
(
	id					int				PRIMARY KEY IDENTITY,	--位置id
	parent_id			int				NOT NULL,				--0表示逻辑上的根节点
	parent_ids			varchar(1000)	NOT NULL,				--父节点列表
	gero_id				int				NOT NULL,				--街道id，关联GERO
	type				int				,						--no use
	level				int				,						--no use
	name				nvarchar(64)	NOT NULL,				--位置名称
	full_name			nvarchar(500)	,						--位置全名 no use
	del_flag			char(1)			NOT NULL	DEFAULT '0'	--默认0，删除1	
)
;


CREATE TABLE T_ELDER
(
	id					int				PRIMARY KEY IDENTITY,	--老人ID
	name				nvarchar(20) 	NOT NULL,				--老人姓名
	gero_id				int				NOT NULL,				--街道id，关联GERO
	nssf_id				varchar(50)		,						--老人社保卡号
	archive_id			varchar(20)		,						--档案编号，不清楚用处，街道要求加的。
	area_id				int				,						--老人所在小区，关联T_AREA表
	care_level			int				,						--老人护理等级
	checkin_date		date			,						--入院日期
	checkout_date		date			,						--离院日期
	apply_url			varchar(256)	,						--申请表url（图片）
	survey_url			varchar(256)	,						--调防表url（图片）
	assess_url			varchar(256)	,						--审批表url（图片）
	track_url			varchar(256)	,						--7天跟踪记录表url（图片）
	pad_mac				varchar(17)		,						--老人房间pad的mac，用于绑定上传信息
)
;



CREATE TABLE T_ELDER_RELATIVE
(
	id					int				PRIMARY KEY IDENTITY,	--家属ID
	name				nvarchar(20)	NOT NULL,				--名字
	urgent				bit				,						--是否紧急联系人
	relationship		nvarchar(20)	,						--与老人关系，optional
	cancel_date			datetime		,						--注销日期
)
;

CREATE TABLE T_ELDER_RELATIVE_RELATIONSHIP
(
	relative_user_id	int				NOT NULL,				--家属user_ID
	elder_user_id		int				NOT NULL,				--老人user_ID
	CONSTRAINT uc_Elder_Relative_Relation UNIQUE (relative_user_id,elder_user_id)
)
;



CREATE TABLE T_ELDER_TEMPERATURE
(
	id					int				PRIMARY KEY IDENTITY,
	elder_id			int				NOT NULL,				--
	doctor_id			int				NOT NULL,				--
	temperature			float			NOT NULL,				--
	time				datetime		NOT NULL,				--
)

CREATE TABLE T_ELDER_HEART_RATE
(
	id					int				PRIMARY KEY IDENTITY,
	elder_id			int				NOT NULL,				--
	doctor_id			int				NOT NULL,				--
	rate				float			NOT NULL,				--
	time				datetime		NOT NULL,				--
)

CREATE TABLE T_ELDER_BLOOD_PRESSURE
(
	id					int				PRIMARY KEY IDENTITY,
	elder_id			int				NOT NULL,				--
	doctor_id			int				NOT NULL,				--
	diastolic_pressure	float			NOT NULL,				--
	systolic_pressure	float			NOT NULL,				--
	time				datetime		NOT NULL,				--
)

CREATE TABLE T_STAFF
(
	id					int				PRIMARY KEY IDENTITY,
	name				nvarchar(20)	NOT NULL,				--
	nssf_id				varchar(20)		,						--社保卡账号
	gero_id				int				NOT NULL,				--关联T_GERO表
	basic_url			varchar(50)		,						--员工基本信息表扫描件的地址
	leave_date			date			,						--离职时间
	archive_id			varchar(20)		,						--纸质档案编号
)
;

CREATE TABLE T_CARER_ITEM_RELATIONSHIP
(
	staff_user_id		int				NOT NULL,				--护工的user_ID，关联staff表
	care_item_id		int				NOT NULL,				--护理项目id，关联T_CARE_ITEM
	CONSTRAINT uc_Carer_Item_Relation UNIQUE (staff_user_id,care_item_id)
)
;

CREATE TABLE T_ORDER
(
	id					bigint				PRIMARY KEY IDENTITY,	--订单表id
	carer_id			int				NOT NULL,				--关联T_STAFF表
	elder_id			int				NOT NULL,				--关联T_ELDER表
	care_item_id		int				NOT NULL,				--关联T_CARE_ITEM表
	item_name			nvarchar(32)	NOT NULL,				--项目名
	item_detail			nvarchar(512)	,						--订单描述
	order_type			int 			NOT NULL,				-- 0:call center
	status				int 			NOT NULL,				--订单状态（见后） 
	order_time			datetime		,						--预订时间
	rate 				int 			,						--评分
	rate_detail 		nvarchar(512)	,						--评语
	revisit_content		nvarchar(512)	,						--回访
	call_start			datetime		,						--通话开始时间
	call_end			datetime		,						--通话结束时间
	call_type			int 			,						--0:本地通话1:国内长途2:国际长途
    call_detail         nvarchar(512)   ,                       --通话备注
)
;
--状态：
--0:开始 1:未提交 2:已提交，待确认 3.已确认 4:已派单 5:已完成未评价
--6: 已评价 7:已取消 8:已关闭（系统取消）

CREATE TABLE T_ORDER_CHANGE_RECORD
(
	id					int				PRIMARY KEY IDENTITY,	--订单操作记录id
	order_id			int				NOT NULL,				--订单id，关联T_ORDER表
	operator_id			int 			NOT NULL,				--关联T_user表
	old_status			int 			NOT NULL,				--上状态
	new_status			int 			NOT NULL,				--当前状态						
	time				datetime		NOT NULL,				--操作时间

)
;

CREATE TABLE T_CAREWORK_RECORD
(
	id					int				PRIMARY KEY IDENTITY,
	carer_id			int				NOT NULL,				--关联T_STAFF表
	elder_id			int				NOT NULL,				--关联T_ELDER表
	care_item_id		int				NOT NULL,				--关联T_CARE_ITEM表
	item_name			nvarchar(32)	NOT NULL,				--项目名
	finish_time			datetime		NOT NULL,				--完成时间
)
;


CREATE TABLE T_STAFF_SCHEDULE_PLAN
(
	id					int				PRIMARY KEY IDENTITY,
	staff_id			int				NOT NULL,				--
	gero_id				int				NOT NULL,				--
	work_date			date			NOT NULL,				--
)
;



CREATE TABLE T_ROLE
(
	id					int				PRIMARY KEY IDENTITY,
	gero_id				int				NOT NULL,				--关联T_GERO，如果为1，表明是系统角色，不能删除
	name				nvarchar(50)	NOT NULL,				--角色名称
	notes				nvarchar(32)	NOT NULL,				--备注
)
;

CREATE TABLE T_PRIVILEGE
(
	id					int				PRIMARY KEY IDENTITY,
	name				nvarchar(50)	NOT NULL,				--权限名
	parent_id			int				NOT NULL,				--父亲结点，顶级菜单id为1，其父节点为虚拟结点，为0
	parent_ids			varchar(1000)	NOT NULL,				--所有父亲权限列表，用逗号分隔，从0开始。添加到索引
	permission			varchar(255)	,						--shiro权限字符串
	api					varchar(255)	,						--api
	href				varchar(255)	,						--链接
	icon				varchar(100)	,						--图标
	notes				nvarchar(500)	,						--权限说明
)
;

CREATE TABLE T_ROLE_PRIVILEGES
(
	id					int				PRIMARY KEY IDENTITY,
	role_id				int				NOT NULL,				--
	privilege_id		int				,						--
)
;

CREATE TABLE T_USER_ROLES
(
	id					int				PRIMARY KEY IDENTITY,
	user_id				int				NOT NULL,				--
	role_id				int				NOT NULL,				--
)
;


CREATE TABLE T_CARE_ITEM
(
	id					int				PRIMARY KEY IDENTITY,	--
	gero_id				int				NOT NULL,				--gero_id=1时为默认项目
	name				nvarchar(32)	NOT NULL,				--
	icon				varchar(32)		,						--
	level				int				,						--
	period				int				,						--
	frequency			int				,						--
	start_time			time(0)			,						--
	end_time			time(0)			,						--
	notes				nvarchar(32)	,						--
	del_flag			char(1)			NOT NULL	DEFAULT '0'	--默认0，删除1	
)
;



ALTER TABLE T_GERO
ADD CONSTRAINT fk_GERO_staff_id
FOREIGN KEY (contact_id)
REFERENCES T_STAFF(id)
;

ALTER TABLE T_USER
ADD CONSTRAINT fk_USER_gero_id
FOREIGN KEY (gero_id)
REFERENCES T_GERO(id)
;

ALTER TABLE T_AREA
ADD CONSTRAINT fk_AREA_gero_id
FOREIGN KEY (gero_id)
REFERENCES T_GERO(id)
;

ALTER TABLE T_ELDER
ADD CONSTRAINT fk_ELDER_gero_id
FOREIGN KEY (gero_id)
REFERENCES T_GERO(id)
;

-- ALTER TABLE T_ELDER
-- ADD CONSTRAINT fk_ELDER_area_id
-- FOREIGN KEY (area_id)
-- REFERENCES T_AREA(id)
-- ;


ALTER TABLE T_ELDER_TEMPERATURE
ADD CONSTRAINT fk_ELDER_TEMPERATURE_elder_id
FOREIGN KEY (elder_id)
REFERENCES T_ELDER(id)
;

ALTER TABLE T_ELDER_TEMPERATURE
ADD CONSTRAINT fk_ELDER_TEMPERATURE_doctor_id
FOREIGN KEY (doctor_id)
REFERENCES T_STAFF(id)
;

ALTER TABLE T_ELDER_HEART_RATE
ADD CONSTRAINT fk_ELDER_HEART_RATE_elder_id
FOREIGN KEY (elder_id)
REFERENCES T_ELDER(id)
;

ALTER TABLE T_ELDER_HEART_RATE
ADD CONSTRAINT fk_ELDER_HEART_RATE_doctor_id
FOREIGN KEY (doctor_id)
REFERENCES T_STAFF(id)
;

ALTER TABLE T_ELDER_BLOOD_PRESSURE
ADD CONSTRAINT fk_ELDER_BLOOD_PRESSURE_elder_id
FOREIGN KEY (elder_id)
REFERENCES T_ELDER(id)
;

ALTER TABLE T_ELDER_BLOOD_PRESSURE
ADD CONSTRAINT fk_ELDER_BLOOD_PRESSURE_doctor_id
FOREIGN KEY (doctor_id)
REFERENCES T_STAFF(id)
;

ALTER TABLE T_STAFF
ADD CONSTRAINT fk_STAFF_gero_id
FOREIGN KEY (gero_id)
REFERENCES T_GERO(id)
;


ALTER TABLE T_STAFF_SCHEDULE_PLAN
ADD CONSTRAINT fk_STAFF_SCHEDULE_PLAN_carer_id
FOREIGN KEY (staff_id)
REFERENCES T_STAFF(id)
;

ALTER TABLE T_STAFF_SCHEDULE_PLAN
ADD CONSTRAINT fk_STAFF_SCHEDULE_PLAN_gero_id
FOREIGN KEY (gero_id)
REFERENCES T_GERO(id)
;


ALTER TABLE T_ROLE
ADD CONSTRAINT fk_ROLE_gero_id
FOREIGN KEY (gero_id)
REFERENCES T_GERO(id)
;

ALTER TABLE T_ROLE_PRIVILEGES
ADD CONSTRAINT fk_ROLE_PRIVILEGES_role_id
FOREIGN KEY (role_id)
REFERENCES T_ROLE(id)
ON DELETE CASCADE
;

ALTER TABLE T_ROLE_PRIVILEGES
ADD CONSTRAINT fk_ROLE_PRIVILEGES_privilege_id
FOREIGN KEY (privilege_id)
REFERENCES T_PRIVILEGE(id)
ON DELETE CASCADE
;

ALTER TABLE T_USER_ROLES
ADD CONSTRAINT fk_USER_ROLES_staff_id
FOREIGN KEY (user_id)
REFERENCES T_USER(id)
ON DELETE CASCADE
;

ALTER TABLE T_USER_ROLES
ADD CONSTRAINT fk_USER_ROLES_role_id
FOREIGN KEY (role_id)
REFERENCES T_ROLE(id)
ON DELETE CASCADE
;

ALTER TABLE T_CARE_ITEM
ADD CONSTRAINT fk_CARE_ITEM_gero_id
FOREIGN KEY (gero_id)
REFERENCES T_GERO(id)
;























