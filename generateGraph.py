import matplotlib.pyplot as plt
import sys
import pymongo
import numpy as np
# Connect to MongoDB server
client = pymongo.MongoClient("mongodb://localhost:27017/adminDB")
# Select database and collection
db = client["adminDB"]
col = db[sys.argv[1]+"Details"]
# Find all documents in the collection
docs = list(col.find())
x = []
y = []
# for d in docs:
#     print(d)
# print(type(docs))
for i in range(0, len(docs)):
    # print(docs[i])
    x.append(docs[i]['month'])
    y.append(docs[i]['Net Sales/Income from operations'])

# Convert the dates to years
years = []
sales = []
for date,sale in zip(x, y):
    # print(date)
    try:
        years.append(int(date[:4]))
        sales.append(sale)
    except(ValueError):
        pass
unique_years = np.unique(years)
average_income = []
for year in unique_years:
    mask = np.array(years) == year
    year_sales = np.array(sales)[mask]
    year_average_income = year_sales.mean()
    average_income.append(year_average_income)
print(unique_years)    
plt.bar(unique_years, average_income)
plt.xlabel('Year')
plt.ylabel('Net Sales/Income from operations in Rs. (in Cr.)')
plt.title('Average Sales by year')
plt.xticks(unique_years, rotation=45, fontsize=8)
plt.savefig('./public/images/myplot.png')
print("hello", sys.argv[2])