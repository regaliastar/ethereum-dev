import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
# % matplotlib inline
from sklearn.linear_model import LogisticRegression
from sklearn.externals import joblib

## DataFrame格式
diabetesDF = pd.read_csv('cleaned.csv')


# 查看数据
def printOutcome():
	outcome_col = diabetesDF.Outcome
	s_1 = 0
	for index in outcome_col:
		if outcome_col[index] == 1:
			s_1=s_1+1
	s_0 = len(outcome_col) - s_1

	print('s_1: ', s_1, 's_0: ', s_0)
	x = ['0','1']
	y = [s_0,s_1]

	plt.bar(x, y, align = 'center')
	# plt.xlim((0,1))
	plt.xlabel('Outcome')
	plt.ylabel('Number')
	plt.show()

# printOutcome()

## A: 
## B: 120
## C: 69
## D: 

######### 分组训练
def trainList(trainList):
	length = len(trainList)
	i = 0
	while i<length:
		trainData = trainList[i][0]
		trainLabel = trainList[i][1]
		diabetesCheck = LogisticRegression(solver='liblinear')
		diabetesCheck.fit(trainData, trainLabel)
		# 测试
		accuracy = diabetesCheck.score(testData, testLabel)
		# print(diabetesCheck.coef_)
		print(i+1, " accuracy = ", accuracy * 100, "%")
		# 保存
		fn = "model/model"+str(i)
		joblib.dump(diabetesCheck, fn)
		i=i+1

def splitTrain(num, totalTrain):
	length = len(totalTrain)/num
	i = 1
	list = []
	while i<=length:
		index = num*i
		dfTrain = totalTrain[:index]
		trainLabel = np.asarray(dfTrain['Outcome'])
		trainData = np.asarray(dfTrain.drop('Outcome',1))
		means = np.mean(trainData, axis=0)
		stds = np.std(trainData, axis=0)
		trainData = (trainData - means)/stds
		list.append([trainData, trainLabel])
		i=i+1
	return list

num = 100
modelCount = 700/num
dfTrain = diabetesDF[:700]
dfTrainList = splitTrain(num, dfTrain)
dfTest = diabetesDF[700:]

testLabel = np.asarray(dfTest['Outcome'])
testData = np.asarray(dfTest.drop('Outcome',1))
trainLabel = np.asarray(dfTrain['Outcome'])
trainData = np.asarray(dfTrain.drop('Outcome',1))
means = np.mean(trainData, axis=0)
stds = np.std(trainData, axis=0)
testData = (testData - means)/stds
trainData = (trainData - means)/stds
# 对分组进行训练
trainList(dfTrainList)

# load检验
def getAverage(num):
	print('进入 getAverage')
	i=1
	list = np.zeros(8)
	while i<num:
		fn="model/model"+str(i)
		joblib_model = joblib.load(fn)
		coef = joblib_model.coef_
		j=0
		# 有8个属性
		while j<8:
			list[j] = list[j]+coef[0][j]
			j=j+1
		i=i+1
	k=0
	while k<8:
		list[k] = list[k]/modelCount
		k=k+1
	print('退出 getAverage')
	return list

avgList = getAverage(modelCount)

# 测试
joblib_model = joblib.load('model/model0')	# 本身和model0无关，只是借用joblib_model
joblib_model.coef_ = np.array([avgList])
accuracy = joblib_model.score(testData, testLabel)
print(joblib_model.coef_)
print("平均model accuracy = ", accuracy * 100, "%")

# 对照
# 开始机器学习
print("直接训练全部数据")
diabetesCheck = LogisticRegression(solver='liblinear')
diabetesCheck.fit(trainData, trainLabel)
print(diabetesCheck.coef_)
accuracy = diabetesCheck.score(testData, testLabel)
print("accuracy = ", accuracy * 100, "%")
print("###############")

# TODO
# 试试过拟合，将数据集再细分，并且有重合发生