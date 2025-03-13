import xml.etree.ElementTree as ET
import json

def jtl_to_json(jtl_file):
    tree = ET.parse(jtl_file)
    root = tree.getroot()

    results = []
    for sample in root.findall('httpSample'):
        result = {}
        for child in sample:
            result[child.tag] = child.text
        results.append(result)

    return json.dumps(results, indent=4)

# Example usage
with open('results/result.jtl', 'w') as json_file:
    json_file.write(jtl_to_json('results/result.jtl'))
