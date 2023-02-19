import json
import uuid

def write_data_to_json(data):
    # Open the JSON file for writing
    with open('newData.json', 'w') as file:
        # Write the data to the file in JSON format
        json.dump(data, file)


client_data = {}
scraped_data = {}
# Open the JSON file for reading
with open('data.json', 'r') as file:
  # Load the contents of the file into a variable
  client_data = json.load(file)
with open('allison.json', 'r') as file:
  # Load the contents of the file into a variable
  scraped_data = json.load(file)

created_items = {}
for elem in scraped_data:
  for item in elem["menuItems"]:
    created_item_data = {"name": item["name"],
                         "description": item["description"],
                         "location": "Allison",
                         "reviews": {"0": ""}
                        }
    uuid_key = str(uuid.uuid4())
    created_items[uuid_key] = created_item_data
    print(created_item_data)
    
    
client_data["locations"]["Allison"] = {"name": "Allison",
                                       "averageRating": 0,
                                       "topItem": "TBD",
                                       "imageLink": "placeholder"}
for key,val in created_items.items():
  client_data["items"][key] = val
# print(client_data)
# print(uuid.uuid4())

write_data_to_json(client_data)

# Print the contents of the variable
# print(client_data, scraped_data)
