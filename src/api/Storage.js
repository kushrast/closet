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

	getStyles = () => {
		return Promise.resolve([
			"Casual", 
			"Smart Casual", 
			"Millenial Smart",
			"Athleisure", 
			"Americana", 
			"Outdoors", 
			"Street Casual",
			"Street Smart", 
			"Summer Chill"]);
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
		outfitId = encodeURIComponent(outfitId);
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

	createNewOutfit = (outfit) => {
		outfit = JSON.parse(JSON.stringify(outfit));
		outfit["styles"] = outfit["styles"].map((value) => value.toLowerCase());
		outfit["other_tags"] = outfit["other_tags"].map((value) => value.toLowerCase());

		var json_outfit = JSON.stringify(outfit);
		json_outfit = encodeURIComponent(json_outfit);

		return new Promise((resolve, reject) => {
			axios.post('http://127.0.0.1:5000/closet/outfit/new?outfit='+json_outfit)
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

	updateOutfit = (outfit) => {
		outfit = JSON.parse(JSON.stringify(outfit));
		outfit["styles"] = outfit["styles"].map((value) => value.toLowerCase());
		outfit["other_tags"] = outfit["other_tags"].map((value) => value.toLowerCase());

		var json_outfit = JSON.stringify(outfit);
		json_outfit = encodeURIComponent(json_outfit);

		return new Promise((resolve, reject) => {
			axios.post('http://127.0.0.1:5000/closet/outfit/update?outfit='+json_outfit)
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

	validatePotentialOutfit = (outfit) => {
		outfit = JSON.parse(JSON.stringify(outfit));
		outfit["styles"] = outfit["styles"].map((value) => value.toLowerCase());
		outfit["other_tags"] = outfit["styles"].map((value) => value.toLowerCase());

		var json_outfit = JSON.stringify(outfit);
		json_outfit = encodeURIComponent(json_outfit);

		return new Promise((resolve, reject) => {
			axios.get('http://127.0.0.1:5000/closet/outfit/validate?outfit='+json_outfit)
			  .then(function (response) {
			    // handle success
			    resolve(response.data);
			  })
			  .catch(function (error) {
			    // handle error
			    reject(error.response.data);
			  });
		});
	}

	getClothesOfType = (clothingType) => {
		// Make a request for a user with a given ID
		clothingType = encodeURIComponent(clothingType);
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

	getSearchPredictions = (searchString) => {
		searchString = encodeURIComponent(searchString);
		// Make a request for a user with a given ID
		return new Promise((resolve, reject) => {
			axios.get('http://127.0.0.1:5000/closet/search/predictions?query='+searchString)
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

	search = (searchParams) => {
		searchParams = JSON.parse(JSON.stringify(searchParams));
		searchParams["styles"] = Object.keys(searchParams["styles"]).map((value) => value.toLowerCase());
		searchParams["type"] = searchParams["type"].toLowerCase();
		searchParams["weatherRatings"] = Object.keys(searchParams["weatherRatings"]);
		searchParams["containsClothing"] = Object.keys(searchParams["containsClothing"]);
		searchParams["clothingTypes"] = Object.keys(searchParams["clothingTypes"]).map((value) => value.toLowerCase());
		searchParams["tags"] = Object.keys(searchParams["tags"]).map((value) => value.toLowerCase());

		searchParams = encodeURIComponent(JSON.stringify(searchParams));

		return new Promise((resolve, reject) => {
			axios.get('http://127.0.0.1:5000/closet/search?params='+searchParams)
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

	getClothing = (clothingId) => {
		clothingId = encodeURIComponent(clothingId);
		return new Promise((resolve, reject) => {
			axios.get('http://127.0.0.1:5000/closet/clothes?id='+clothingId)
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

	validatePotentialClothing = (clothing) => {
		clothing = JSON.parse(JSON.stringify(clothing));
		clothing["styles"] = clothing["styles"].map((value) => value.toLowerCase());

		var json_clothing = JSON.stringify(clothing);
		json_clothing = encodeURIComponent(json_clothing);

		return new Promise((resolve, reject) => {
			axios.get('http://127.0.0.1:5000/closet/clothes/validate?clothing='+json_clothing)
			  .then(function (response) {
			    // handle success
			    resolve(response.data);
			  })
			  .catch(function (error) {
			    // handle error
			    reject(error.response.data);
			  });
		});
	}

	createNewClothing = (clothing) => {
		clothing = JSON.parse(JSON.stringify(clothing));
		clothing["styles"] = clothing["styles"].map((value) => value.toLowerCase());

		var json_clothing = JSON.stringify(clothing);
		json_clothing = encodeURIComponent(json_clothing);

		return new Promise((resolve, reject) => {
			axios.post('http://127.0.0.1:5000/closet/clothes/new?clothing='+json_clothing)
			  .then(function (response) {
			    // handle success
			    resolve(response.data);
			  })
			  .catch(function (error) {
			    // handle error
			    reject(error.response.data);
			  });
		});
	}

	updateClothing = (clothing) => {
		clothing = JSON.parse(JSON.stringify(clothing));
		clothing["styles"] = clothing["styles"].map((value) => value.toLowerCase());

		var json_clothing = JSON.stringify(clothing);
		json_clothing = encodeURIComponent(json_clothing);

		return new Promise((resolve, reject) => {
			axios.post('http://127.0.0.1:5000/closet/clothes/update?clothing='+json_clothing)
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

	refineClothing = () => {
		return new Promise((resolve, reject) => {
			axios.get('http://127.0.0.1:5000/closet/clothes/refine')
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
export const validatePotentialOutfit = apiHubStorageClient.validatePotentialOutfit;
export const createNewOutfit = apiHubStorageClient.createNewOutfit;
export const updateOutfit = apiHubStorageClient.updateOutfit;

export const getClothing = apiHubStorageClient.getClothing;
export const validatePotentialClothing = apiHubStorageClient.validatePotentialClothing;
export const createNewClothing = apiHubStorageClient.createNewClothing;
export const updateClothing = apiHubStorageClient.updateClothing;
export const refineClothing = apiHubStorageClient.refineClothing;

export const getClothesOfType = apiHubStorageClient.getClothesOfType;
export const getStyles = localStorageClient.getStyles;

export const getSearchPredictions = apiHubStorageClient.getSearchPredictions;
export const search = apiHubStorageClient.search;