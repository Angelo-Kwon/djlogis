package com.dc.controller;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.math3.stat.correlation.PearsonsCorrelation;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.signaflo.math.operations.DoubleFunctions;
import com.github.signaflo.timeseries.TimeSeries;
import com.github.signaflo.timeseries.Ts;
import com.github.signaflo.timeseries.forecast.Forecast;
import com.github.signaflo.timeseries.model.arima.Arima;
import com.github.signaflo.timeseries.model.arima.ArimaOrder;
import com.google.gson.Gson;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;

@RestController
public class DcArimaController {
    @PostMapping("/stockBarChart")
    public String stockBarChart() throws IOException, CsvException {
    	InputStream stream = getClass().getResourceAsStream("/static/csv/VINBST.csv");
    	InputStreamReader streamReader = new InputStreamReader(stream, StandardCharsets.UTF_8);
        List<Double> stock = new ArrayList<>();
        // 데이터 읽기
        try (CSVReader reader = new CSVReader(streamReader)) {
            reader.skip(1);
            String[] nextLine = null;
            while ((nextLine = reader.readNext()) != null) {
            	stock.add(Double.parseDouble(nextLine[1]));
            }
        } catch (IOException | CsvException e) {
            e.printStackTrace();
        }
        // 예측할 데이터 수
        int forecastSize = 12;
        // train 데이터
        List<Double> train = stock.subList(0, stock.size() - forecastSize);
        // test 데이터
        List<Double> test = stock.subList(stock.size() - forecastSize, stock.size());
        // 파라미터 p, d, q 
        ArimaOrder arimaOrder = ArimaOrder.order(2, 1, 2);
        // 파라미터 m
        TimeSeries timeSeries = Ts.newMonthlySeries(DoubleFunctions.arrayFrom(train));
        // 파라미터 p, d, q, P, D, Q
        ArimaOrder seasonalArimaOrder = ArimaOrder.order(1, 1, 0, 0, 1, 0);
        // ARIMA 모형
        Arima arima = Arima.model(timeSeries, arimaOrder);
        // S-ARIMA 모형
        Arima seasonalArima = Arima.model(timeSeries, seasonalArimaOrder);
        // ARIMA 예측 결과
        Forecast forecast = arima.forecast(forecastSize);
        // S-ARIMA 예측 결과
        Forecast seasonalForecast = seasonalArima.forecast(forecastSize);
        List<Double> pred = forecast.pointEstimates().asList();
        List<Double> pred_s = seasonalForecast.pointEstimates().asList();
        
        double[] testData = ArrayUtils.toPrimitive(test.toArray(new Double[test.size()]));
        double[] predData = ArrayUtils.toPrimitive(pred.toArray(new Double[test.size()]));
        double[] predSeasonalData = ArrayUtils.toPrimitive(pred_s.toArray(new Double[test.size()]));
        // 피어슨 상관계수
        double corr = new PearsonsCorrelation().correlation(testData, predData);
        double corr_s = new PearsonsCorrelation().correlation(testData, predSeasonalData);
        // RMSE
        double rmse = RMSE(testData, predData);
        double rmse_s = RMSE(testData, predSeasonalData);
        // MAPE
        double mape = MAPE(testData, predData);
        double mape_s = MAPE(testData, predSeasonalData);
        
        Map<String, Object> result = new HashMap<>();
        result.put("pred", pred);
        result.put("pred_s", pred_s);
        result.put("corr", corr);
        result.put("corr_s", corr_s);
        result.put("rmse", rmse);
        result.put("rmse_s", rmse_s);
        result.put("mape", mape);
        result.put("mape_s", mape_s);

        String jsonResult = new Gson().toJson(result);

        return jsonResult;
    }

    private double RMSE(double[] test, double[] pred) {
        double sum = 0.0;
        for (int i = 0; i < test.length; i++) {
            double diff = test[i] - pred[i];
            sum = sum + diff * diff;
        }
        double mse = sum / test.length;
        return Math.sqrt(mse);
    }

    private double MAPE(double[] test, double[] pred) {
        double sum = 0.0;
        for (int i = 0; i < test.length; i++) {
            double absoluteError = Math.abs(test[i] - pred[i]);
            sum = sum + (absoluteError / test[i]);
        }
        return (sum / test.length) * 100;
    }
    
    @PostMapping("/deliveryBarChart")
    public String deliveryBarChart() throws IOException, CsvException {
    	InputStream stream = getClass().getResourceAsStream("/static/csv/VOUBST.csv");
    	InputStreamReader streamReader = new InputStreamReader(stream, StandardCharsets.UTF_8);
        List<Double> delivery = new ArrayList<>();
        // 데이터 읽기
        try (CSVReader reader = new CSVReader(streamReader)) {
            reader.skip(1);
            String[] nextLine = null;
            while ((nextLine = reader.readNext()) != null) {
            	delivery.add(Double.parseDouble(nextLine[1]));
            }
        } catch (IOException | CsvException e) {
            e.printStackTrace();
        }
        // 예측할 데이터 수
        int forecastSize = 12;
        // train 데이터
        List<Double> train = delivery.subList(0, delivery.size() - forecastSize);
        // test 데이터
        List<Double> test = delivery.subList(delivery.size() - forecastSize, delivery.size());
        // 파라미터 p, d, q 
        ArimaOrder arimaOrder = ArimaOrder.order(2, 1, 2);
        // 파라미터 m
        TimeSeries timeSeries = Ts.newMonthlySeries(DoubleFunctions.arrayFrom(train));
        // 파라미터 p, d, q, P, D, Q
        ArimaOrder seasonalArimaOrder = ArimaOrder.order(1, 1, 0, 0, 1, 0);
        // ARIMA 모형
        Arima arima = Arima.model(timeSeries, arimaOrder);
        // S-ARIMA 모형
        Arima seasonalArima = Arima.model(timeSeries, seasonalArimaOrder);
        // ARIMA 예측 결과
        Forecast forecast = arima.forecast(forecastSize);
        // S-ARIMA 예측 결과
        Forecast seasonalForecast = seasonalArima.forecast(forecastSize);
        List<Double> pred = forecast.pointEstimates().asList();
        List<Double> pred_s = seasonalForecast.pointEstimates().asList();
       
        double[] testData = ArrayUtils.toPrimitive(test.toArray(new Double[test.size()]));
        double[] predData = ArrayUtils.toPrimitive(pred.toArray(new Double[test.size()]));
        double[] predSeasonalData = ArrayUtils.toPrimitive(pred_s.toArray(new Double[test.size()]));
        // 피어슨 상관계수
        double corr = new PearsonsCorrelation().correlation(testData, predData);
        double corr_s = new PearsonsCorrelation().correlation(testData, predSeasonalData);
        // RMSE
        double rmse = RMSE(testData, predData);
        double rmse_s = RMSE(testData, predSeasonalData);
        // MAPE
        double mape = MAPE(testData, predData);
        double mape_s = MAPE(testData, predSeasonalData);
        
        Map<String, Object> result = new HashMap<>();
        result.put("pred", pred);
        result.put("pred_s", pred_s);
        result.put("corr", corr);
        result.put("corr_s", corr_s);
        result.put("rmse", rmse);
        result.put("rmse_s", rmse_s);
        result.put("mape", mape);
        result.put("mape_s", mape_s);

        String jsonResult = new Gson().toJson(result);

        return jsonResult;
    }
	 
}