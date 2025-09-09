package com.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NoticeBoardMapper {

	int selectNoticeCnt(Map<String, Object> param);
	
	List<Map<String, Object>> selectNoticeList(Map<String, Object> param);

	Map<String, Object> selectNoticeDetailInfo(Map<String, Object> param);

	int insertNoticeInfo(Map<String, Object> dataMap);

	int updateNoticeUseYn(Map<String, Object> upd);

	void updateNoticeHitCnt(Map<String, Object> param);

	void deleteNotice(List<String> deleteNoList);
	
	List<Map<String, Object>> selectNewsList(Map<String, Object> param);
}
