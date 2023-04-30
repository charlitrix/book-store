/**
 * Represents StoreData
 * @typedef {Object} StoreData
 * @property {User} - user data
 * @property {token} - user authentication token
 * @property {isLoggedIn} - authentication status
 */

/**
 *
 * @param {Object} state - current user data
 * @param {Object} action - dispatch details on task to be executed
 * @returns {StoreData}  data object
 */

export function dataStoreReducer(state, action) {
  switch (action.type) {
    case "SAVE_USER_DATA": {
      return {
        ...state,
        user: action.payload,
      };
    }
    case "SAVE_TOKEN": {
      return {
        ...state,
        token: action.payload,
      };
    }
    case "USER_AUTHENTICATED": {
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    }
    case "LOG_OUT": {
      return {
        user: {},
        token: "",
        isLoggedIn: false,
      };
    }

    case "LOG_IN": {
      return { ...state, ...action.payload };
    }
    case "UPDATE_CART": {
      let item = state.cart
        ? state.cart.find((item) => item.id === action.payload.id)
        : {};
      if (item && item.id) {
        return {
          ...state,
          cart: state.cart.map((book) => {
            if (book.id === item.id) {
              return {
                ...book,
                quantity: book.quantity + action.payload.quantity,
              };
            }
            return book;
          }),
        };
      }
      return state.cart
        ? { ...state, cart: [...state.cart, action.payload] }
        : { ...state, cart: [action.payload] };
    }
    case "DELETE_CART_ITEM": {
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    }
    case "CLEAR_CART": {
      return {
        ...state,
        cart: [],
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
