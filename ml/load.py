import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
# % matplotlib inline
from sklearn.linear_model import LogisticRegression
from sklearn.externals import joblib

## DataFrame格式
diabetesDF = pd.read_csv('diabetes_brash.csv')

# 机器学习之前
dfTrain = diabetesDF[:700]
dfTest = diabetesDF[700:750]
dfCheck = diabetesDF[750:]

trainLabel = np.asarray(dfTrain['Outcome'])
trainData = np.asarray(dfTrain.drop('Outcome',1))
testLabel = np.asarray(dfTest['Outcome'])
testData = np.asarray(dfTest.drop('Outcome',1))

means = np.mean(trainData, axis=0)
stds = np.std(trainData, axis=0)
trainData = (trainData - means)/stds
testData = (testData - means)/stds
# np.mean(trainData, axis=0) => check that new means equal 0
# np.std(trainData, axis=0) => check that new stds equal 1

# 加载数据集
joblib_model = joblib.load('diabeteseModel.pkl')[0]
# joblib_model.coef_ = [[ 0.45818298  1.12179561 -0.26213807  0.02891693 -0.12122805  0.72288803 0.30710308  0.10907746]]
print(joblib_model.coef_)
print(len(joblib_model.coef_))
# print(diabetesCheck.get_params())

accuracy = joblib_model.score(testData, testLabel)
print("accuracy = ", accuracy * 100, "%")

