export const natsWrapper = {
    client: {
        publish: (subject: string, daa: string, callback: () => void) => {
            callback();
        },
    },
};
