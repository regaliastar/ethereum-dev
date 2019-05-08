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
def corr_heat():
	df = pd.read_csv('kc_house_data.csv')
	conv_dates = [1 if values == 2014 else 0 for values in df.date ]
	# df['date'] = conv_dates
	df = df.drop(['id'],axis=1)
	dfData = abs(df.corr())
	plt.subplots(figsize=(15, 15)) # 设置画面大小
	sns.heatmap(dfData, annot=True, vmax=1, square=True, cmap="Blues")
	plt.show()
# corr_heat()


# 图4.3
def autolabel(rects, ax, xpos='center'):
	xpos = xpos.lower()  # normalize the case of the parameter
	ha = {'center': 'center', 'right': 'left', 'left': 'right'}
	offset = {'center': 0.5, 'right': 0.57, 'left': 0.43}  # x_txt = x + w*off
	for rect in rects:
		height = rect.get_height()
		ax.text(rect.get_x() + rect.get_width()*offset[xpos], 1.01*height,
                '{}'.format(height), ha=ha[xpos], va='bottom')
def bar_exam():
	x = ('50', '100', '150', '200')	#任务数
	#实验一
	y1 = (55094, 104914, 158476, 203867)	#类型A时间 ms
	y2 = (54932, 99941, 156932, 201743)		#类型B时间 ms
	#实验二
	y3 = (56726, 117421, 173741, 236907)	#类型A时间 ms 未优化
	y4 = (55412, 114597, 163948, 220110)	#类型B时间 ms 优化
	n_groups = 4
	fig, ax = plt.subplots()
	index = np.arange(n_groups)
	bar_width = 0.30
	opacity = 0.4
	rects1 = ax.bar(index, y3, bar_width,
                alpha=opacity, color='b',
                label='class A')
	rects2 = ax.bar(index + bar_width, y4, bar_width,
                alpha=opacity, color='r',
                label='class B')
	autolabel(rects1, ax, 'center')
	autolabel(rects2, ax, 'center')
	ax.set_xlabel('tasks Number')
	ax.set_ylabel('time/ms')
	ax.set_title('')
	ax.set_xticks(index + bar_width / 2)
	ax.set_xticklabels(x)
	ax.legend()
	fig.tight_layout()
	plt.show()

# bar_exam()

# 折线图 图4.6
def line_chart():
	x = ('50', '100', '150', '200')	#任务数
	#实验一
	# y1 = (55094, 104914, 158476, 203867)	#类型A时间 ms
	# y2 = (54932, 99941, 156932, 201743)		#类型B时间 ms
	#实验二
	y3 = (56726, 117421, 173741, 236907)	#类型A时间 ms 未优化
	y4 = (55412, 114597, 163948, 220110)	#类型B时间 ms 优化
	fig, ax = plt.subplots()
	# ax.plot(x, y1, label="experiment 1 A")
	# ax.plot(x, y2, label="experiment 1 B")
	ax.plot(x, y3, label="class A")
	ax.plot(x, y4, label="class B")
	ax.legend()
	plt.show()
# line_chart()

# 三角函数图
def sin_chart():
	#创建一个6×8的图框，像素为100
	plt.figure(figsize=(6,8),dpi=100)
	#创建一个子图，网格为1×1
	plt.subplot(111)
	x = np.linspace(-np.pi,np.pi,256,endpoint=True)
	y = np.sin(x)
	z = np.cos(x)
	#画图，使用不同的颜色和线条
	plt.plot(x,y,color='blue',linewidth=1.0,linestyle='-')
	plt.plot(x,z,color='red',linewidth=1.0,linestyle='-')
	#设置x轴的范围
	plt.xlim(x.min()*1.1,x.max()*1.1)
	#设置x轴的标尺刻度，从-4到4，取9个值
	plt.xticks([-np.pi,-np.pi/2,0,np.pi/2,np.pi],[r'$-\pi$',r'$-\pi/2$',r'$0$',r'$\pi/2$',r'$\pi$'])
	#设置y轴的范围
	plt.ylim(y.min()*1.1,y.max()*1.1)
	#设置y轴的标尺刻度，从-1到1，取5个值
	plt.yticks([-1,0,1],[r'$-1$',r'$0$',r'$1$'])
	ax = plt.gca()#获取当前轴线实例
	ax.xaxis.set_ticks_position('bottom')#x轴线，使用spine中的bottom线
	ax.yaxis.set_ticks_position('left')#y轴线，使用spine中的left线
	ax.spines['bottom'].set_position(('data',0))#将bottom线的位置设置为数据为0的位置
	ax.spines['left'].set_position(('data',0))#将left线的位置设置为数据为0的位置
	ax.spines['top'].set_color('none')#将top线的颜色设置为无
	ax.spines['right'].set_color('none')#将right线的颜色设置为无
	plt.plot(x,y,label='Sin(x)')
	plt.plot(x,z,label='Cos(x)')
	plt.legend(loc='upper left')#将图例放在左上角
	t = 2*np.pi/3
	plt.plot([t,t],[0,np.cos(t)], color ='blue', linewidth=1.5, linestyle="--")
	plt.scatter([t,],[np.cos(t),], 50, color ='blue')
	plt.annotate(r'$\cos(\frac{2\pi}{3})=\frac{\sqrt{3}}{2}$',
	xy=(t, np.cos(t)), xycoords='data',
	xytext=(+10, +30), textcoords='offset points', fontsize=16,
	arrowprops=dict(arrowstyle="->", connectionstyle="arc3,rad=.2"))
	plt.show()
# sin_chart()

def sin_chart_2():
	# 生成数组作为横坐标
    x = np.linspace(-np.pi, np.pi, 256, endpoint=True)
    cos = np.cos(x)
    sin = np.sin(x)
    plt.figure(1)
    # 绘制cos函数
    plt.plot(x, cos, color="blue", linewidth=1.0, linestyle='-', label='cos')
    # 绘制sin函数
    plt.plot(x, sin, color="red", linewidth=1.0, linestyle='-', label='sin')
    # 设置标题
    plt.title('trigonometric function')
    #------绘制坐标------
    ax = plt.gca()
    # 设置坐标四周的样式
    ax.spines['right'].set_color('none')
    ax.spines['top'].set_color('none')
    ax.spines['left'].set_position(('data', 0))
    ax.spines['bottom'].set_position(('data', 0))
    # 设置坐标值显示的位置
    ax.xaxis.set_ticks_position('bottom')
    ax.yaxis.set_ticks_position('left')
    # 设置坐标显示内容
    plt.xticks([-np.pi, -np.pi/2, 0, np.pi/2, np.pi],
                [r'$-\pi$', r'$-\pi/2$', r'$0$', r'$+\pi/2$', r'$+\pi$'])
    plt.yticks(np.linspace(-1, 1, 5, endpoint=True))
    # 设置每个坐标的样式
    for label in ax.get_xticklabels() + ax.get_yticklabels():
        label.set_fontsize(8)
        label.set_bbox(dict(facecolor='white', edgecolor='None', alpha=0.5))

    # 设置图例所在位置
    plt.legend(loc='upper left')
    # 设置网格
    plt.grid()
    # 绘制填充区域
    plt.fill_between(x, np.abs(x) < 0.5, cos, cos > 0.5, color='blue', alpha=0.2)
    t = 1
    # 绘制直线
    plt.plot([t, t], [0, np.cos(t)], 'y', linewidth=3, linestyle='--')
    # 绘制注解
    plt.annotate('cos(1)', xy=(t, np.cos(1)), xycoords='data', xytext=(10, 30), textcoords='offset points',arrowprops=dict(arrowstyle='->',connectionstyle='arc3,rad=0.2'))
    plt.show()
# sin_chart_2()

# 散点图
def scatter():
	x = np.random.normal(0, 1, 500)
	y = np.random.normal(0, 1, 500)
	t = np.arctan2(x, y)
	plt.scatter(x, y, alpha=0.5, c=t, s=70)
	plt.show()
# scatter()

# 房价分布图
def show_price():
	houses = pd.read_csv('kc_house_data.csv')
	sns.distplot(houses['price'], color="g")
	plt.show()
# show_price()

# 图5.5
def show_acc_GBR():
	x = ['MLR', 'GBR']
	y1 = [73.2, 92.0]
	bar_width = 0.30
	opacity = 0.4
	plt.bar(x, y1, alpha=0.8)
	plt.ylabel('accuracy')
	for x,y in enumerate(y1):
		plt.text(x,y+2,y,ha='center')
	plt.show()
# show_acc_GBR()

# 图5.6
def five_six():
	x = ['对照组', '实验组']
	y1 = [185693, 94386]
	plt.rcParams['font.sans-serif']=['SimHei']
	plt.bar(x, y1, alpha=0.8)
	plt.ylabel('耗时/ms')
	for x,y in enumerate(y1):
		plt.text(x,y+500,y,ha='center')
	plt.show()
# five_six()