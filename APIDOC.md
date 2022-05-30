# Jewelry Store API Documentation
This API is meant to provide data on jewelry, FAQ, and contact information for
a jewelry store. Data is provided for products, frequently asked questions of the
store, and contact requests made by users. For more information, see endpoints 
below.

## jewelry
**Request Format:** /jewelry?type=?&color=?&price=?&style=?

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns a list of jewelry meeting the requirements specified in the query parameters of the endpoint.

**Example Request:** /jewelry?type=necklace&color=gold&price=20&style=formal

**Example Response:**
```
[{"id":1,"product_name":"Dual Band Ring","descrip":"Why have one when you can have two?","img_path":"img/rings/dual_band_ring.jpg","prod_type":"ring","price":29.99,"color":"gold","style":"casual"},{"id":2,"product_name":"Dual Color Ring","descrip":"Silver? Gold? Por que no los dos?","img_path":"img/rings/dual_color_ring.jpg","prod_type":"ring","price":19.99,"color":"dual","style":"casual"},{"id":3,"product_name":"Olive Leaf Ring","descrip":"For the nature-inclined.","img_path":"img/rings/olive_tree_ring.jpg","prod_type":"ring","price":59.99,"color":"gold","style":"casual"},
...
{"id":15,"product_name":"Sweetheart Necklace","descrip":"For the girl next door.","img_path":"img/necklaces/sweetheart_necklace.jpg","prod_type":"necklace","price":59.99,"color":"silver","style":"formal"}]
```

**Error Handling:**
A 400 error code is sent in the response if the request has an invalid field
filled in a category.

A 500 error code is sent in the response if the server failed to retrieve the 
query. No error code is sent in the response if the query returns empty. Instead,
an empty list is returned.

**Error Output:**
400 code error: Bad client request: invalid jewelry type/color/style/price limit

500 code error: Internal server error, please try again later.

## jewelry/id
**Request Format:** /jewelry/id

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns information for a single jewelry product based on its
unique ID in the database, as specified in the request parameters.

**Example Request:** /jewelry/12

**Example Response:**
```json
[{"id":12,"product_name":"Silver Drop Necklace","descrip":"Perfect for a fancy dinner.","img_path":"img/necklaces/drop_necklace.jpg","prod_type":"necklace","price":39.99,"color":"silver","style":"formal"}]
```

**Error Handling:**
A 500 error code is sent in the response if the server failed to retrieve the 
query. A 400 error code is sent in the response if the query returns empty, since
every valid id should result in a query result from the database.

**Error Output:**
If invalid query, 400 error:
Bad client request: jewelry does not exist.

If error is produced in retrieving from the database, 500 error:
Internal server error, please try again later.

## contact
**Request Format:** /contact

**Request Type:** POST

**Returned Data Format**: Plain text

**Description:** Fulfills a post request for inserting a contact attempt's
information in the contact table of the database.

**Example Request:** 
```
// Post entry to server
let url = "/contact";

const params = new FormData();
params.append("name", "Jerry Smith");
params.append("email", "jsmith@email.com");
params.append("message", "I'm missing my order!");

let resp = await fetch(url, {
    method: "POST", 
    body: params
  });
...
```

**Example Response:**
"Message successfully sent."

**Error Handling:**
A 400 error code is sent in the response if the post request is incomplete.
A 500 error code is sent in the response if the post request failed, i.e. the 
data could not be inserted into the database. No error code is sent in the 
response if the contact information is successfully added to the database. 

**Error Output:**
400 error code: Bad client request: empty POST parameters name, email, or 
message in /contact.

500 error code: Internal server error, please try again later.

## random
**Request Format:** /random

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Retrieves a json file which consists of an array of three 
dictionaries. Each of these dictionaries corresponds to a jewelry product and 
contains information for the product. One of the dictionaries is for a necklace,
one is for a ring, and one is for earrings, forming one set of jewelry.*

**Error Handling:**
A 500 error code is sent in the response if the server failed to retrieve the 
query or the query returns empty. 

**Error Output:**
Internal server error, please try again later.

```json
[{"id":14,"product_name":"Gold Ruby Necklace","descrip":"Red and gold and red and gold!","img_path":"img/necklaces/ruby_necklace.jpg","prod_type":"necklace","price":29.99,"color":"red","style":"casual"},{"id":6,"product_name":"Blue Heart Earrings","descrip":"Feeling blue?","img_path":"img/earrings/blue_heart_earrings.jpg","prod_type":"earring","price":29.99,"color":"blue","style":"casual"},{"id":1,"product_name":"Dual Band Ring","descrip":"Why have one when you can have two?","img_path":"img/rings/dual_band_ring.jpg","prod_type":"ring","price":29.99,"color":"gold","style":"casual"}]
```

**Error Handling:**
A 500 error code is sent in the response if the server failed to retrieve the 
query or the query returns empty. 

**Error Output:**
Internal server error, please try again later.

## faq
**Request Format:** /faq

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns 5 json objects, each of which contains a question and 
an answer. These correspond to frequently asked questions.

**Example Request:** /faq

**Example Response:**
```
[{"faq_id":1,"question":"How long does shipping take?","answer":"Shipping typically \ntakes 2 weeks for U.S. orders. We don't ship internationally yet, but we're \nhoping to expand soon!"},{"faq_id":2,"question":"What was the inspiration for this store?","answer":"We made \na jewelry store because high-quality jewelry is typically hard to come by at \naffordable prices. We try to provide high-quality items at prices that are \nsignificantly lower than other brands."},{"faq_id":3,"question":"What kind of jewelry do you guys offer?","answer":"We offer \na variety of rings, necklaces, and earrings with precious metals and stones. We \nhope to offer bracelets and more niche jewelry types in the future!"},{"faq_id":4,"question":"What's your return policy?","answer":"We will take returns \nup to one month (30 days) after purchase. After this period, returns cannot be \nmade."},{"faq_id":5,"question":"Can I buy this jewelry in person?","answer":"Unfortunately, \nno. We only offer our goods online. We hope to open in-person stores within the \nnext 5 years!"}]
```

**Error Handling:**
A 500 error code is sent in the response if the server failed to retrieve the 
query or the query returns empty. 

**Error Output:**
Internal server error, please try again later.