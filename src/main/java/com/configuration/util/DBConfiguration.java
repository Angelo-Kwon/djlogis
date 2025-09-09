package com.configuration.util;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
@PropertySource("classpath:/application.properties")
public class DBConfiguration {

	// Hikari 설정 1
	public HikariConfig hikariConfig() { // 환경 설정 객체
		return new HikariConfig();
	}

	// Hikari 설정 2
	public DataSource dataSource() { // 객체를 생성

		DataSource dataSource = new HikariDataSource(hikariConfig());
		System.out.println(dataSource.toString());

		return dataSource;
	}

	// MyBatis 설정 1 : SqlSessionFactory <-- SqlSessionFactoryBean
	public SqlSessionFactory sqlSessionFactory() throws Exception {
		SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
		return factoryBean.getObject();
	}

	// MyBatis 설정 2 : SqlSessionTemplate <-- SqlSessionFactory
	public SqlSessionTemplate sqlSessionTemplate() throws Exception {
		return new SqlSessionTemplate(sqlSessionFactory());
	}

}
