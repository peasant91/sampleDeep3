import RNFetchBlob from 'rn-fetch-blob'

export const downloadFileApi = async (url, filename) => {
    try {

        let dirs = RNFetchBlob.fs.dirs


        RNFetchBlob
            .config({
                // add this option that makes response data to be stored as a file,
                // this is much more performant.
                // fileCache : true,
                // path: RNFS.DocumentDirectoryPath + `/${fileName}`
                path: (Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir) + `/${filename}`
            })
            .fetch('GET', url, {
                //some headers ..
            }).then( res => {
                console.log('file saved to', res.path())
            }
            )
        return {
            fileName: filename
        }
    } catch (err) {
        throw (err.message)
    }
}