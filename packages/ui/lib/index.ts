export const formatPrice = (price: number) => {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
        useGrouping: false,
    });
    return formatter.format(price);
};
