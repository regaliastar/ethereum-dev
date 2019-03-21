import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
# % matplotlib inline
from sklearn.linear_model import LogisticRegression
from sklearn.externals import joblib

## DataFrame格式
diabetesDF = pd.read_csv('diabetes_brash.csv')

# corr = diabetesDF.corr()
# print(corr)
# sns.heatmap(corr, 
#          xticklabels=corr.columns, 
#          yticklabels=corr.columns)

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

# 开始机器学习
diabetesCheck = LogisticRegression()
diabetesCheck.fit(trainData, trainLabel)

print(diabetesCheck.coef_)

accuracy = diabetesCheck.score(testData, testLabel)
print("accuracy = ", accuracy * 100, "%")

# 保存模型
# joblib.dump(diabetesCheck, 'diabeteseModel.pkl')