//////////// MATH-RELATED TOOLS ////////////

// Calculate subtotal considering price, amount, and an optional discount or surcharge factor
const calculateSubtotal = (
    price: number,
    amount: number,
    discountSurcharge?: number
): number => {
    if (price === null || price === undefined) {
        throw new Error('Cannot calculate subtotal with an empty price')
    }

    if (amount === null || amount === undefined) {
        throw new Error('Cannot calculate subtotal with an empty amount')
    }

    // if discountSurcharge is not provided or its zero, defaults to 1
    const factor = discountSurcharge || 1

    return price * amount * factor
}

// Format a factor as a percentage. Can be negative
const formatFactorToPercentage = (factor: number): number => {
    if (factor === null || factor === undefined) {
        throw new Error('Cannot format an empty factor')
    }

    return (factor - 1) * 100
}

// Format a percentage as a factor. Always positive
const formatPercentageToFactor = (percentage: number): number => {
    if (percentage === null || percentage === undefined) {
        throw new Error('Cannot format an empty percentage')
    }

    return 1 + percentage * 0.01
}

const Math = {
    calculateSubtotal,
    formatFactorToPercentage,
    formatPercentageToFactor,
}

export default Math
