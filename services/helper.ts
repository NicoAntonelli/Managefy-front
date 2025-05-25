import { AxiosResponse } from 'axios'

const validateResponse = (response: AxiosResponse<any, any>) => {
    if (!response) {
        throw new Error('No response from API')
    } else if (response.status !== 200) {
        throw new Error(
            `API responded with an invalid status: ${response.status} '${response.statusText}'`
        )
    } else if (!response.data) {
        throw new Error('API responded with 200 but with an empty body')
    }
}

const Helper = { validateResponse }
export default Helper
