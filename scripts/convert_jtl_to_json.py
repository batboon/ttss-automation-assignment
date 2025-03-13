import csv
import json

def jtl_to_json(jtl_file):
    with open(jtl_file, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        result = [row for row in reader]
    return json.dumps(result, indent=4)

# Write to JSON file
with open('output.json', 'w', encoding='utf-8') as json_file:
    json_file.write(jtl_to_json('results/result.jtl'))
