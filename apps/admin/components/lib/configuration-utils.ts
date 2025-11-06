export async function updateConfiguration(configId: string, updates: Record<string, unknown>) {
    try {
        const response = await fetch(`/api/configurations/${configId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
        })

        if (!response.ok) {
            const errorText = await response.text()
            let errorData
            try {
                errorData = JSON.parse(errorText)
            } catch {
                throw new Error(`HTTP ${response.status}: ${errorText}`)
            }
            throw new Error(errorData.error || `HTTP ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error("Failed to update configuration:", error)
        throw error
    }
}

export async function getConfiguration(productId: string) {
    try {
        const response = await fetch(`/api/configurations/${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            const errorText = await response.text()
            let errorData
            try {
                errorData = JSON.parse(errorText)
            } catch {
                throw new Error(`HTTP ${response.status}: ${errorText}`)
            }
            throw new Error(errorData.error || `HTTP ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error("Failed to fetch configuration:", error)
        throw error
    }
}
