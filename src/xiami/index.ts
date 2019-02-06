/// <reference path="../types/flyio.d.ts"/>
import MusicApi from '../music.api.class'
import Fly from 'flyio/dist/npm/fly'
import setApi from './set-api'

export default class Xiami extends MusicApi {
    public Api: Fly
    constructor(adapter: any) {
        super(adapter)
        this.Api = new Fly(this.engine)
        setApi(this.Api)
    }

    private replaceImage(url = '') {
        return url.replace('http', 'https').replace('_1.jpg', '_4.jpg').replace('_1.png', '_4.png')
    }
    private getMusicInfo(info: any) {
        const purviewRoleVOs = info.purviewRoleVOs
        const brObject: { [key: string]: string } = {}
        purviewRoleVOs.forEach((item: any) => {
            brObject[item.quality] = item.isExist
        })
        const maxbr = brObject.s ? 999000 : (brObject.h ? 320000 : 128000)
        return {
            album: {
                id: info.albumId,
                name: info.albumName,
                cover: this.replaceImage(info.albumLogo)
            },
            artists: [{
                id: info.artistId,
                name: info.artistName
            }],
            name: info.songName,
            songId: info.songId,
            cp: !info.listenFiles.length,
            maxbr,
            mv: info.mvId || null,
            vendor: 'xiami'
        }
    }

    async search({ keyword = '', limit = 30, page = 1, type = 'song' }) {
        const params = {
            key: keyword,
            pagingVO: {
                page,
                pageSize: limit
            }
        }
        const { songs, pagingVO }: any = await this.Api.get('/search/searchSongs', params, {
            webApi: true
        })
        return {
            total: pagingVO.count,
            songs: songs.map((item: any) => this.getMusicInfo(item))
        }
    }
    async getSongDetail(ids: Array<number>) {
        this.checkId(ids)
        const data: any = await this.Api.get('mtop.alimusic.music.songservice.getsongs', {
            songIds: ids
        })
        return data.songs.map((song: any) => this.getMusicInfo(song))
    }
}