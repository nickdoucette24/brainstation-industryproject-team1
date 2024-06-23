#!/usr/bin/env python
# coding: utf-8

# In[1]:


# !!!Important note: run the scrapper first to obtain the daily csv before any data analysis!!!
# This script is for comparing the price difference between Dell and Canada Computers & Electronics (CCE)


# Import necessary libraries
import pandas as pd
import csv
import time
import datetime
import matplotlib.pyplot as plt
import numpy as np


# In[2]:


# The followings are to prepare the variables

current_time = datetime.datetime.now()
date = str(current_time.year) + str(current_time.month) + str(current_time.day)


# In[3]:


# Import all csvs needed for this comparison
# !!!Important: the index.csv file is a local file. Make sure you put the correct path here to find the file

index = pd.read_csv('d:/dropbox/brainstation/index.csv')
dell = pd.read_csv(f'offcial_dell_monitor{date}.csv')
newegg = pd.read_csv(f'newegg_dell_monitor{date}.csv')
newegg['Newegg_price'] = newegg['Newegg_price'].astype(float)


# In[4]:


# Merge the csvs into a big table

df = pd.merge(index, newegg, how = "left", on = ['Newegg_sku'])
df = pd.merge(df, dell, how = "left", on = ['Dell_product'])
df=df[['Dell_product', 'Newegg_sku', 'Newegg_price', 'Dell_price']]
df.dropna(axis = 0, inplace = True)


# In[5]:


# Create a new column of how the retailer's price is different from Dell's price
df['Price_dif'] = df['Newegg_price'] - df['Dell_price']


# In[6]:


offender = df.sort_values('Price_dif', ascending = True)


# In[7]:


# We are separating "offenders" from "deviated"
# 'Offenders' means the products that the retailer undercutting Dell
# 'Deviated' means the products that sold with different price with Dell

offender = df.loc[df['Price_dif'] < 0].sort_values('Price_dif', ascending = True)
deviated = df.loc[df['Price_dif'] != 0].sort_values('Price_dif', ascending = True)


# In[8]:


# The followings are to provide some headers

# Total products sold with this retailer
print(f'Total products listed here are {df.shape[0]}.')

# Total offending products from this retailer
print(f'Total offending products are {offender.shape[0]}.')

# Total deviated products
print(f'Total deviated products are {deviated.shape[0]}.')


# Compliance rate
# Important note: This is to recording only the products that are undercutting.
# Which means it does not count the products those are sold more expensive than Dell.
# It is rounded to integar.
print(f'The compliance rate is {round((df.shape[0] - offender.shape[0]) / df.shape[0] * 100)}%.')


# In[9]:


# List the offending products with a descending order in a bar chart

plt.figure()
plt.bar(offender['Dell_product'], offender['Price_dif'])
plt.xticks(rotation=-45)
plt.ylabel('Price difference in $CAD')
plt.xlabel('Dell product')
plt.show()


# In[10]:


# Make a line graph showing the deviation percentage of each product from this retailer

df['Deviation'] = df['Price_dif'] / df['Dell_price'] * 100
df_deviation_order = df.sort_values('Deviation', ascending = True)

plt.figure()
plt.plot(df_deviation_order['Dell_product'], df_deviation_order['Deviation'])
plt.xticks(rotation=-45)
plt.title('The deviation % of Newegg\'s price comparing to Dell MSRP')
plt.ylabel('Price deviation %')
plt.xlabel('Dell product')
plt.show()


# In[11]:


# Calculate avg. deviation
dev_perc = round(df_deviation_order['Deviation'].mean(),2)
print(f'The average deviation for this retailer is: {dev_perc}%.')


# In[12]:


# The following is to bring out the Retailer page categorizing deviation percentage into colored status

conditions = [(df['Deviation'] >= 0), (df['Deviation'] < 0) & (df['Deviation'] >= (-10)), (df['Deviation'] < (-10))]
status = ['Green', 'Yellow', 'Red']
df['Status'] = np.select(conditions, status)
display(df[['Dell_product', 'Dell_price', 'Newegg_price', 'Deviation', 'Status']].sort_values('Deviation', ascending = True))


# In[13]:


# Below is to save the comparison results as csv. Do not run unless it's necessary

#save = df[['Dell_product', 'Dell_price', 'Newegg_price', 'Deviation', 'Status']].sort_values('Deviation', ascending = True)
#save.to_csv(f'newegg_comparison{date}.csv')

