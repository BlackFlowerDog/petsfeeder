# petsfeeder
Simple web-interface of the system of smart feeders for cats and dogs
## What is it?
Educational project. A Python + Flask bundle was used for the server side in order to avoid constantly uploading files to the board and slowing down editing. The interface can be used for a real system of smart feeders. ***The current server part is not intended for downloading to the board, but is only needed for more convenient debugging.***

List of features:

    1. Button for filling the bowl
    2. Visual display of data from feed level sensors
    3. Storing information about pets
    4. Setting up a feeding schedule
    5. Displaying the time until the next feeding
    
## Detailed description of the functionality and screenshots of the pages
### Pages
There are only four pages: one with basic information (pet data, schedule, time until the next feeding, feed level), two for editing schedules and a list of pets, and one more - a blank, some information about the development team.

Menu.

![menu](https://user-images.githubusercontent.com/115879518/208164146-deca5dc6-0390-48a7-8367-c750b6b4867e.png)

#### MAIN

Data about pets are displayed in card-tables.
| № | field name     |
|-----:|-----------|
| 1 | pet name |
| 2 | type (cat or dog) |
| 3 | sex (male or female) |
| 4 | birthday (if it was entered) |
| 5 | years old (calculated based on the date of birth and the current date in the system) | 
| 6 | Is the scheduled feeding function activated or deactivated? |

Under the main information is a photo of the pet. If the photo was not uploaded when adding a pet, default-cat or default-dog will be used, depending on the specified type of animal. To switch between pets, you need to use the arrows located on both sides of the card. The cross in the upper left corner removes the currently displayed pet (appears only on the "add pet" page).

![petcard](https://user-images.githubusercontent.com/115879518/208161563-c92b5e26-3caa-49c2-b81f-c3f8a0cc9563.png)

When you hover the cursor over the black schedule icon on the bottom right, the feeding time used will drop out, but only if the feeding time is activated. Even if the pet has a saved schedule, it will not be displayed.

![time_petcard](https://user-images.githubusercontent.com/115879518/208164313-5cf7942d-b29f-434a-92e5-33b39354e907.png)

If there are no safe pets, the card template will be displayed.

![card_template](https://user-images.githubusercontent.com/115879518/208209117-a6bb3811-a6e2-4576-b6ea-875eb75a3018.png)

On the right is a meter that displays data from the feed level sensors in the bowl. When the arrow is pointed at the red sector, its color changes from pale to a richer red.

Under the meter is a timer counting down the time until the next feeding (works if the schedule is activated).
There is a bowl filling button under the timer.

![meter_timer](https://user-images.githubusercontent.com/115879518/208162012-c6af291b-892c-43c8-afb6-64dc19dd4f4a.png)

#### ADD PETS

On the left there is a block with already existing pets. To the right of it is a form for entering data about a new pet. Required fields: name, gender and type (cat/dog) of the animal. The name can be up to 10 characters long.
To add a pet, click the jackdaw icon located at the bottom right.
Pet removal is also available from this page (Cross in the upper left corner of pet card).

![add_pet](https://user-images.githubusercontent.com/115879518/208162183-0e7e70fb-0369-49ec-b2c1-3b85bcabae3b.png)

When uploading a photo, its thumbnail, size and name will be displayed.

![uploads_image](https://user-images.githubusercontent.com/115879518/208162381-090d6608-9ccd-4e54-ae82-a77df5c234fe.png)

If you do not upload your photo to the server, then the "default-cat.jpg" and default-dog.jpg" will be used as a pet photo.

![def_cat](https://user-images.githubusercontent.com/115879518/208162599-49b3b04b-9ead-477e-883a-8f4664d05d55.png)

![def_dog](https://user-images.githubusercontent.com/115879518/208163160-6d12e06d-172f-447b-aad2-04fa30a0d5ac.png)

#### EDIT SCHEDULES

On the left is the card of the pet whose schedule is displayed. When switching between pets using the arrows, the schedule will change accordingly. It is displayed regardless of whether the feeding function is activated or not.

![schedule_editor](https://user-images.githubusercontent.com/115879518/208163360-2104b4ae-956f-44e8-b646-f4ceedf06d3c.png)

Abilities:
    - Activate or deactivate feeding by time. When deactivated, the schedule used is saved;
    - Reset the schedule completely;
    - Remove a specific time from the schedule (cross next to the entry in the table);
    - Add a new feeding time to the schedule.

If the pet does not have saved times, a template will be displayed.

![schedule_template](https://user-images.githubusercontent.com/115879518/208209249-c9947ca0-bddb-47b0-97bd-a0b986e6f6ce.png)

#### ABOUT US

Can be used to fill in information about the team of creators

![about_us](https://user-images.githubusercontent.com/115879518/208163697-eec44ffb-17f3-4627-a366-94d92660c84e.png)

### config.json

All animal data is stored in the "config.json" file, used as an analogue of a small database.
An example of a record about one pet.

```
{ 
  "Cocca": 
  {
    "type": true,
    "photoName": "Cocca201c72b1-aa26-4a61-a765-ded2347e65c3.jpg",
    "birthday": "",
    "sex": true,
    "schedule": 
      {
        "activate": false,
        "time": ["12:12"]
      }
  }
}
```

All pets are stored as entries in the dictionary. The key is the name of the animal, so adding several pets with the same names is not possible.
Type - cat (true), dog (false). Sex - male (true), female (false).

The name of the pet is added to the beginning of the name of the uploaded photo to create a unique name for the photo in order to avoid its erroneous deletion if the user uploads two photos with the same name.

"activate" - is responsible for activating the feeding schedule. "time" - an array with feeding time sorted in ascending order.

### From the server

The server sends all data in JSON format.

1. Data from feed level sensors is received at "/api/get_pet_food_level". They are sent in the form of a JSON dictionary, where the key is the name of the pet, the value is the percentage of filling the bowl.

```
{
  "Cocca": 2,
  "Tim": 3
}
```
2. Data about all pets for drawing cards and schedules is sent to "/api/get_pets". This is a read JSON dictionary from "config.json".
3. For the timer to work, all pet schedules are sent to "/api/get_schedule" in JSON dictionary format, where the key is the name of the animal, the value is the schedule field.

```
{
   "Cocca": 
    { 
      "activate": true,
      "time": ["12:12, "15:10"]
    },
    "Tim": 
    {
      "activate": false,
      "time": []
    }
}
```
  4. After making changes to the schedule, you need to re-draw new information on the page. The schedule for one pet is sent to "/api/get_schedule/<petName>", where "<petName>" is the pet name of the current card. A simple schedule will be sent.
 
```
  { 
      "activate": true,
      "time": ["12:12", "15:10"]
  }
```

### To the server
  
1. Adding a pet
  
The data is sent by a POST request. Available by name: pet name - "name", type - "type" (takes the values either cat or dog, true/false will be saved to the server, respectively), photo - "photo", sex - "gender" (takes the values either male or female, true/false will be saved to the server, respectively), activation of feeding by time - "isSchedule" (takes the values either on or off, true/false will be saved to the server, respectively).
  
2. Removing a pet
  
GET request, deletion is performed by name.
 
Request: /delete_pet?delete_pet=${CURRENT_NAME}.
 
The name of the required argument is "delete_pet". When deleting, photos with names "default-cat.jpg" and "default-dog.jpg" should not be deleted.

3. Schedule editing: resetting the schedule, adding time, deleting time, activating the use of the schedule
  
All four actions are processed at /settings/schedule and are GET requests.

The first argument in the request will be the name of the action being performed ("delete_time", "change_activate", "add_time", "reset_schedul"), can be obtained by the name action, the second is the name of the pet, can be obtained by the name "pet_name". When deleting or adding time, a third argument appears - the time being added or deleted, which can be obtained by the name "time".
  
Request examples:
  
```
  /settings/schedule?action=delete_time&pet_name=Cocca&time=12:12
  /settings/schedule?action=change_activation&pet_name=Cocca
  /settings/schedule?action=add_time&pet_name=Cocca&time=15:10
  /settings/schedule?action=reset_schedule&pet_name=Cocca
```
4. Filling the bowl
A stub function is used, sending a response from the server that the bowl is replenished.
