import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
# % matplotlib inline
from sklearn.linear_model import LogisticRegression
from sklearn.externals import joblib

## DataFrame格式
# diabetesDF = pd.read_csv('diabetes.csv')
# cleanedDF = pd.read_csv('cleaned.csv')

# 热力图5.2
def corr_heat(df):
    dfData = abs(df.corr())
    plt.subplots(figsize=(9, 9)) # 设置画面大小
    sns.heatmap(dfData, annot=True, vmax=1, square=True, cmap="Blues")
   # plt.savefig('./BluesStateRelation.png')
    plt.show()

# corr_heat(diabetesDF)
# corr_heat(cleanedDF)

def autolabel(rects, ax, xpos='center'):
	xpos = xpos.lower()  # normalize the case of the parameter
	ha = {'center': 'center', 'right': 'left', 'left': 'right'}
	offset = {'center': 0.5, 'right': 0.57, 'left': 0.43}  # x_txt = x + w*off
	for rect in rects:
		height = rect.get_height()
		ax.text(rect.get_x() + rect.get_width()*offset[xpos], 1.01*height,
                '{}'.format(height), ha=ha[xpos], va='bottom')
# 图4.1
def bar_4_1():

	x = ('100', '400', '900', '1600', '2500')	#任务数
	y1 = (950, 2312, 4210, 7556, 9954)	#类型A时间 ms
	y2 = (954, 2012, 4110, 7413, 9849)	#类型B时间 ms
	n_groups = 5
	fig, ax = plt.subplots()
	index = np.arange(n_groups)
	bar_width = 0.35
	opacity = 0.4
	rects1 = ax.bar(index, y1, bar_width,
                alpha=opacity, color='b',
                label='class A')

	rects2 = ax.bar(index + bar_width, y2, bar_width,
                alpha=opacity, color='r',
                label='class B')
	autolabel(rects1, ax, 'center')
	autolabel(rects2, ax, 'center')
	ax.set_xlabel('tasks')
	ax.set_ylabel('time/ms')
	ax.set_title('')
	ax.set_xticks(index + bar_width / 2)
	ax.set_xticklabels(x)
	ax.legend()

	fig.tight_layout()
	plt.show()

bar_4_1()