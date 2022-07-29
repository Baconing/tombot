export function errorHandler(error: any) {
    console.error(error);
    switch (error.message) {
        default: 
            return error.message;
    }
}