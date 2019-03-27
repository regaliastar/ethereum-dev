import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
# % matplotlib inline
from sklearn.linear_model import LogisticRegression
from sklearn.externals import joblib
from sklearn.model_selection import train_test_split
from sklearn import ensemble
import time

## DataFrame格式
diabetesDF = pd.read_csv('cleaned.csv')

# corr = diabetesDF.corr()
# print(corr)
# sns.heatmap(corr, 
#          xticklabels=corr.columns, 
#          yticklabels=corr.columns)

t0 = time.time()
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
# diabetesCheck.fit(trainData, trainLabel)
# accuracy = diabetesCheck.score(testData, testLabel)
# print("accuracy = ", accuracy * 100, "%")
# print(diabetesCheck.coef_)

x_train , x_test , y_train , y_test = train_test_split(trainData , trainLabel , test_size = 0.10,random_state =2)
clf = ensemble.GradientBoostingRegressor(n_estimators = 400, max_depth = 5, min_samples_split = 2,
          learning_rate = 0.1, loss = 'ls')
clf.fit(x_train, y_train)
accuracy = clf.score(x_test,y_test)
print("accuracy = ", accuracy * 100, "%")	# 7.3%

print("时间: ",time.time() - t0)
# 保存模型
# joblib.dump(diabetesCheck, 'diabeteseModel.pkl')