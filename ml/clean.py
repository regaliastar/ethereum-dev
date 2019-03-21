import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
# % matplotlib inline
from sklearn.linear_model import LogisticRegression
from sklearn.externals import joblib

## DataFrame格式
diabetesDF = pd.read_csv('diabetes.csv')

## 清洗数据
def cleanData(DF):
	df = DF
	Glucose = df.Glucose
	length = len(Glucose)
	sum_g=0
	count_g=0
	sum_b=0
	count_b=0
	sum_s=0
	count_s=0
	sum_i=0
	count_i=0
	sum_bmi=0
	count_bmi=0
	i=0
	# 得到总数
	while i<length:
		if(df.Glucose[i] != 0):
			sum_g = sum_g + df.Glucose[i]
			count_g = count_g + 1
		if(df.BloodPressure[i] != 0):
			sum_b = sum_b + df.BloodPressure[i]
			count_b = count_b + 1
		if(df.SkinThickness[i] != 0):
			sum_s = sum_s+df.SkinThickness[i]
			count_s=count_s+1
		if(df.Insulin[i] != 0):
			sum_i=sum_i+df.Insulin[i]
			count_i=count_i+1
		if(df.BMI[i] != 0):
			sum_bmi=sum_bmi+df.BMI[i]
			count_bmi=count_bmi+1
		i = i + 1
	# 设置平均数
	j=0
	while j<length:
		if(df.Glucose[j] == 0):
			df.Glucose[j]=sum_g/count_g
		if(df.BloodPressure[j] == 0):
			df.BloodPressure[j]=sum_b/count_b
		if(df.SkinThickness[j] == 0):
			df.SkinThickness[j]=sum_s/count_s
		if(df.Insulin[j] == 0):
			df.Insulin[j]=sum_i/count_i
		if(df.BMI[j] == 0):
			df.BMI[j]=sum_bmi/count_bmi
		j = j + 1
	return df


df = cleanData(diabetesDF)
pd.DataFrame.to_csv(df,"test.csv")