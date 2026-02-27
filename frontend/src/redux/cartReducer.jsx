// Modified from https://www.freecodecamp.org/news/what-is-redux-store-actions-reducers-explained/

const initialCartState = {
    noOfItemInCart: 0,
    cart: []
};

const cartReducer = (state = initialCartState, action) => {
    switch (action.type) {
        case "SET_CART": {
            const totalItems = action.payload.reduce((sum, item) => sum + item.noOfItem, 0);
            return {
                cart: action.payload,
                noOfItemInCart: totalItems
            };
        }
        case "ADD": {
            const existingCardIndex = state.cart.findIndex(
                (item) => item.id === action.payload.id && item.aId === action.payload.aId
            );

            if (existingCardIndex !== -1) {
                const updatedCart = [...state.cart];
                updatedCart[existingCardIndex].noOfItem += action.payload.noOfItem;

                return {
                    ...state,
                    noOfItemInCart: state.noOfItemInCart + action.payload.noOfItem,
                    cart: updatedCart
                };
            } else {
                return {
                    ...state,
                    noOfItemInCart: state.noOfItemInCart + action.payload.noOfItem,
                    cart: [...state.cart, action.payload]
                };
            }
        }


        case "DELETE": {
            const itemToDelete = state.cart.find(
                item => item.id === action.payload.id && item.aId === action.payload.aId
            );
            const itemCountToRemove = itemToDelete?.noOfItem || 0;

            return {
                ...state,
                cart: state.cart.filter(
                    item => !(item.id === action.payload.id && item.aId === action.payload.aId)
                ),
                noOfItemInCart: Math.max(0, state.noOfItemInCart - itemCountToRemove)
            };
        }

        case "DECREASE": {
            const index = state.cart.findIndex(
                item => item.id === action.payload.id && item.aId === action.payload.aId
            );
            if (index === -1) return state;

            const updatedCart = [...state.cart];
            const currentQty = updatedCart[index].noOfItem;

            if (currentQty <= 1) {
                updatedCart.splice(index, 1);
                return {
                    ...state,
                    cart: updatedCart,
                    noOfItemInCart: Math.max(0, state.noOfItemInCart - 1)
                };
            } else {
                updatedCart[index].noOfItem = currentQty - 1;
                return {
                    ...state,
                    cart: updatedCart,
                    noOfItemInCart: state.noOfItemInCart - 1
                };
            }
        }

        default:
            return state;
    }
};

export default cartReducer;

