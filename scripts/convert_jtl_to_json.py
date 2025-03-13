import csv
import json

def jtl_to_json(jtl_file):
    with open(jtl_file, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        result = [row for row in reader]
    
    # Wrap the result in a dictionary with a 'logs' key
    return json.dumps({"logs": result}, indent=4)

# Write to JSON file
with open('results/result.json', 'w', encoding='utf-8') as json_file:
    json_file.write(jtl_to_json('results/result.jtl'))
