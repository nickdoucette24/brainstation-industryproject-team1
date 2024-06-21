import sys
import pandas as pd
import json

def convert_csv_to_json(file_path):
    df = pd.read_csv(file_path)
    json_data = df.to_json(orient='records')
    print(json_data)

if __name__ == "__main__":
    file_path = sys.argv[1]
    convert_csv_to_json(file_path)