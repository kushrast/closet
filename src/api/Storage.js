const axios = require('axios');

class StorageClient {
	constructor(){}
	getOutfit(outfitId){}
}

class LocalStorageClient extends StorageClient {
	getLocalStorage = () => {
		if (typeof(Storage) !== "undefined") {
		  return window.localStorage;
		} else {
		  return null;
		}
	}

	getOutfit = (outfitId) => {
		return {
	      name: "Outfit #1",
	      jackets: ["Grey Reigning Champ Hoodie"],
	      shirts: ["Black \"Beat LA\" Shirt"],
	      bottoms: ["Black Uniqlo Jeans"],
	      shoes: ["Triple White Jordan 1 Mid's"],
	      weather_rating: "57-63",
	      notes: "Game day move for Giants games or even Warriors games.",
	      styles: ["casual"],
	      other_tags: ["giants", "sports"]
	    }
	}
}

class ApiHubStorageClient extends StorageClient {
	getLocalStorage = () => {
		if (typeof(Storage) !== "undefined") {
		  return window.localStorage;
		} else {
		  return null;
		}
	}

	getOutfit = (outfitId) => {
		// Make a request for a user with a given ID
		return new Promise((resolve, reject) => {
			axios.get('http://127.0.0.1:5000/closet/outfit?id='+outfitId)
			  .then(function (response) {
			    // handle success
			    resolve(response.data);
			  })
			  .catch(function (error) {
			    // handle error
			    reject(error);
			  });
		});
	}

	getClothesOfType = (clothingType) => {
		// Make a request for a user with a given ID
		return new Promise((resolve, reject) => {
			axios.get('http://127.0.0.1:5000/closet/clothes/type?name='+clothingType)
			  .then(function (response) {
			    // handle success
			    resolve(response.data);
			  })
			  .catch(function (error) {
			    // handle error
			    reject(error);
			  });
		});
	}
}

var localStorageClient = new LocalStorageClient();
var apiHubStorageClient = new ApiHubStorageClient();

export const getOutfit = apiHubStorageClient.getOutfit;
export const getClothesOfType = apiHubStorageClient.getClothesOfType;