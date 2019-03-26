import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import mpl_toolkits
from sklearn.linear_model import LinearRegression
# from sklearn.cross_validation import train_test_split
from sklearn.model_selection import train_test_split
from sklearn import ensemble
import time
from sklearn.datasets import load_boston
from sklearn.datasets import make_regression


data = pd.read_csv("kc_house_data.csv")
print('data length: ',len(data))
t0 = time.time()

reg = LinearRegression()
labels = data['price']
conv_dates = [1 if values == 2014 else 0 for values in data.date ]
data['date'] = conv_dates
train1 = data.drop(['id', 'price'],axis=1)

x_train , x_test , y_train , y_test = train_test_split(train1 , labels , test_size = 0.10,random_state =2)
# reg.fit(x_train,y_train)
# accuracy = reg.score(x_test,y_test)	# 73.2%, time:1.6s
clf = ensemble.GradientBoostingRegressor(n_estimators = 400, max_depth = 5, min_samples_split = 2,
          learning_rate = 0.1, loss = 'ls')
clf.fit(x_train, y_train)

accuracy = clf.score(x_test,y_test)	# 91.9%, time:11.5s

print("accuracy: ", accuracy * 100, "%")
print("time: ",time.time() - t0)
