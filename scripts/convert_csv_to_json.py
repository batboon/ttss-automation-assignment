import csv
import json

def csv_to_json(csv_file):
    with open(csv_file, mode='r') as file:
        csv_reader = csv.DictReader(file)
        rows = list(csv_reader)
    
    # Wrap the rows in a dictionary with a 'logs' key
    return json.dumps({"logs": rows}, indent=4)

# Write to JSON file
with open('reports/aggregate_report.json', 'w') as json_file:
    json_file.write(csv_to_json('reports/aggregate_report.csv'))
