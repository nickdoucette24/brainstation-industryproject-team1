#!/usr/bin/env python
# coding: utf-8

# !!!Important note: run the scrapper first to obtain the daily csv before any data analysis!!!
# This script is for comparing the price difference between Dell and BestBuy

# Import necessary libraries
import pandas as pd
import datetime
import matplotlib.pyplot as plt
import numpy as np
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# The followings are to prepare the variables
current_time = datetime.datetime.now()
date = str(current_time.year) + str(current_time.month).zfill(2) + str(current_time.day).zfill(2)

# Directory paths
script_dir = os.path.dirname(__file__)
data_dir = os.path.join(script_dir, 'data')

# Import all csvs needed for this comparison
# !!!Important: the index.csv file is a local file. Make sure you put the correct path here to find the file
index_path = os.path.join(script_dir, 'index.csv')
index = pd.read_csv(index_path)
dell_path = os.path.join(data_dir, f'official_dell_monitor_{date}.csv')
dell = pd.read_csv(dell_path)
bestbuy_path = os.path.join(data_dir, f'bestbuy_dell_monitor_{date}.csv')
bestbuy = pd.read_csv(bestbuy_path)

# Merge the csvs into a big table
df = pd.merge(index, bestbuy, how="left", on=['Bestbuy_sku'])
df = pd.merge(df, dell, how="left", on=['Dell_product'])
df = df[['Dell_product', 'Bestbuy_sku', 'Bestbuy_price', 'Dell_price']]
df.dropna(axis=0, inplace=True)
df['Bestbuy_sku'] = df['Bestbuy_sku'].astype(int)

# Create a new column of how the retailer's price is different from Dell's price
df['Price_dif'] = df['Bestbuy_price'] - df['Dell_price']

offender = df.sort_values('Price_dif', ascending=True)

# We are separating "offenders" from "deviated"
# 'Offenders' means the products that the retailer undercutting Dell
# 'Deviated' means the products that sold with different price with Dell
offender = df.loc[df['Price_dif'] < 0].sort_values('Price_dif', ascending=True)
deviated = df.loc[df['Price_dif'] != 0].sort_values('Price_dif', ascending=True)

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

# List the offending products with a descending order in a bar chart
plt.figure()
plt.bar(offender['Dell_product'], offender['Price_dif'])
plt.xticks(rotation=-45)
plt.ylabel('Price difference in $CAD')
plt.xlabel('Dell product')
plt.show()

# Make a line graph showing the deviation percentage of each product from this retailer
df['Deviation'] = df['Price_dif'] / df['Dell_price'] * 100
df_deviation_order = df.sort_values('Deviation', ascending=True)

plt.figure()
plt.plot(df_deviation_order['Dell_product'], df_deviation_order['Deviation'])
plt.xticks(rotation=-45)
plt.title('The deviation % of Best Buy\'s price comparing to Dell MSRP')
plt.ylabel('Price deviation %')
plt.xlabel('Dell product')
plt.show()

# Calculate avg. deviation
dev_perc = round(df_deviation_order['Deviation'].mean(), 2)
print(f'The average deviation for this retailer is: {dev_perc}%.')

# The following is to bring out the Retailer page categorizing deviation percentage into colored status
conditions = [(df['Deviation'] >= 0), (df['Deviation'] < 0) & (df['Deviation'] >= -10), (df['Deviation'] < -10)]
status = ['Green', 'Yellow', 'Red']
default = 'Unknown'
df['Status'] = np.select(conditions, status, default=default)
print(df[['Dell_product', 'Dell_price', 'Bestbuy_price', 'Deviation', 'Status']].sort_values('Deviation', ascending=True))

# Below is to save the comparison results as csv
save_path = os.path.join(data_dir, f'bestbuy_comparison_{date}.csv')
df[['Dell_product', 'Dell_price', 'Bestbuy_price', 'Deviation', 'Status']].sort_values('Deviation', ascending=True).to_csv(save_path, index=False)
print(f"Comparison results saved to {save_path}")