from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import io, base64
from PIL import Image
import os
import random
class MongoInstance:
    
    def __init__(self) -> None:
        self.mongoClient = MongoClient(os.getenv("MONGODB_URL", "mongodb://root:example@mongo:27017/"))
        self.db = self.mongoClient["main"]
        try:
            # The ping command is cheap and does not require auth.
            self.mongoClient.admin.command('ping')
        except ConnectionFailure:
            print("Server not available")

    def insert_many(self, arr):
        response = self.db["photos"].insert_many(arr)

    def get_all_photos_from_db(self):
        return list(self.db["photos"].find({}))
    
    def get_small_photo(self, id):
        image = list(self.db["photos"].find({ "_id": id}))
        if len(image) == 0:
            raise "ERROR NOT FOUND"
        base64_str = image[0].get("small_image")
        base64_image_str = "data:image/jpeg;base64, " + str(base64_str).split('\'')[1]
        return base64_image_str
    
    def get_large_photo(self, id):
        image = list(self.db["photos"].find({ "_id": id}))
        if len(image) == 0:
            raise "ERROR NOT FOUND"
        base64_str = image[0].get("large_image")
        base64_image_str = "data:image/jpeg;base64, " + str(base64_str).split('\'')[1]
        return base64_image_str
    
    def update_field(self, id, new_value):
        filter = { "_id": id }
        self.db["photos"].update_one(filter, new_value)

class ManagePhotos:

    def __init__(self) -> None:
        self.mongo_instance = MongoInstance()  

    def  save_photos(self, arr):
        return self.mongo_instance.insert_many(arr)

    def  get_photos(self):
        return self.mongo_instance.get_all_photos_from_db()
    
    def get_small_photo(self, id):
        return self.mongo_instance.get_small_photo(int(id))
    
    def get_large_photo(self, id):
        return self.mongo_instance.get_large_photo(int(id))
    
    def likePhoto(self, id):
        new_value = { "$set": { "liked" : True } }
        self.mongo_instance.update_field(id, new_value=new_value)
        return "Photo is liked"

    def dislikePhoto(self, id):
        new_value = { "$set": { "liked" : False } }
        self.mongo_instance.update_field(id, new_value=new_value)
        return "Photo is disliked"

    def save_filter_configurations(self, id, filter_name, filter_style):
        filter_config = {
          "filterName": filter_name,
          "filter": filter_style   
        }
        new_value = { "$set": { "settings" : filter_config }}
        self.mongo_instance.update_field((id), new_value=new_value)
        return "Filter settings updated Successfully."    
    
    @staticmethod
    def get_random_photo_id(min, max):
        return random.randrange(min, max)

