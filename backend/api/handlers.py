from flask import Blueprint, request, send_file, jsonify
from flask_negotiate import consumes, produces
import requests
import base64
import os
import io
import json
from .helpers import ManagePhotos

main_api_blueprint = Blueprint("main_api_blueprint", __name__)
manage_photos = ManagePhotos()


@main_api_blueprint.after_request
def apply_caching(response):
    response.headers['Content-Type'] = 'application/json; image;charset=utf-8'
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', '*')
    response.headers.add('Access-Control-Allow-Headers', '*')
    response.headers.add('Cache-Control', 'no-store')
    return response


@main_api_blueprint.route("/photos", methods=['GET'])
def get_photos():
    
    start = int(request.args.get("start", "0"))
    end = int(request.args.get("end", "10"))
    width = int(request.args.get("width", "200"))
    height = int(request.args.get("height", "200"))
    photos = []
    photos_response = []

    pics_range = end - start

    existing_photos = manage_photos.get_photos()

    is_fetch_require = False

    if len(list(filter(lambda photo: photo.get("_id") == end, existing_photos))) == 0:
        is_fetch_require = True
    
    for i in range(pics_range):
        
        index = (i + start + 1)  
      
        if is_fetch_require:
            snall_image = requests.get(f"https://picsum.photos/id/{index + 30}/{width}/{height}")
            large_image = requests.get(f"https://picsum.photos/id/{index + 30}/{width*2}/{height*2}")
            
            refetch_small_image = False
            refetch_large_image = False
            
            random_image_number = (index + 30)

            if not snall_image or not large_image:
                refetch_small_image = True  
                refetch_large_image = True
                random_image_number = manage_photos.get_random_photo_id(index + 40, 1000)

            while refetch_small_image:
                snall_image = requests.get(f"https://picsum.photos/id/{random_image_number}/{width}/{height}")
                if snall_image:
                    refetch_small_image = False
                    break

            while refetch_large_image:
                large_image = requests.get(f"https://picsum.photos/id/{random_image_number}/{width*2}/{height*2}")
                if large_image:
                    refetch_large_image = False
                    break            
        
            small_base64_bytes = base64.b64encode(snall_image.content)
            large_base64_bytes = base64.b64encode(large_image.content)

            photos.append({
                "_id": index,
                "settings": {},
                "liked": False,
                "small_image": small_base64_bytes,
                "large_image": large_base64_bytes  
            })

        photos_response.append({
           "id": index,
           "liked": existing_photos[index - 1].get("liked", False) if (is_fetch_require == False) else False,
           "settings": existing_photos[index - 1].get("settings", {}) if (is_fetch_require == False) else {},
           "small_image_url": "/smallphoto/{}".format(index),
           "large_image_url": "/largephoto/{}".format(index)               
        })
    
    if is_fetch_require:
        manage_photos.save_photos(photos)

    return json.dumps({"content": photos_response })

@main_api_blueprint.route("/smallphoto/<id>", methods=["GET"])
def get_small_photo(id):
    return jsonify({"content": manage_photos.get_small_photo(id)})

@main_api_blueprint.route("/largephoto/<id>", methods=["GET"])
def get_large_photo(id):
    return jsonify({"content": manage_photos.get_large_photo(id)})

@main_api_blueprint.route("/likephoto", methods=["POST"])
@consumes('application/json')
def like_photo():
    data = request.json
    id = data.get("id", "-1")
    return jsonify({"content": manage_photos.likePhoto(id), "operationStatus": "OK" })


@main_api_blueprint.route("/dislikephoto", methods=["POST"])
@consumes('application/json')
def dislike_photo():
    data = request.json
    id = data.get("id", "-1")
    return jsonify({"content": manage_photos.dislikePhoto(id), "operationStatus": "OK" })

@main_api_blueprint.route("/save_filter_configurations", methods=["PATCH"])
@consumes('application/json')
def save_filter_configurations():
    data = request.json
    id = data.get("id", "-1")
    filter_name = data.get("filterName", "")
    filter_style = data.get("filter", "")
    return jsonify({"content": manage_photos.save_filter_configurations(id, filter_name, filter_style), "operationStatus": "OK" })