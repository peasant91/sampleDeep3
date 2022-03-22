import moment from 'moment'
import momentId from 'moment/src/locale/id' 
export const dummyNewsData = [
    {
        id: 1,
        title: 'lorem ipsum',
        description: 'SCHOTT is the proud supplier of the world\'s first flexible ultra-thin cover glass for foldable... ',
        image: 'https://picsum.photos/200/300',
        created_at: '2021-07-23T11:02:59.000000Z'

    },
    {
        id: 2,
        title: 'lorem ipsum',
        description: 'SCHOTT is the proud supplier of the world\'s first flexible ultra-thin cover glass for foldable... ',
        image: 'https://picsum.photos/200/300',
        created_at: '2021-07-23T11:02:59.000000Z'

    },
    {
        id: 3,
        title: 'lorem ipsum',
        description: 'SCHOTT is the proud supplier of the world\'s first flexible ultra-thin cover glass for foldable... ',
        image: 'https://picsum.photos/200/300',
        created_at: '2021-07-23T11:02:59.000000Z'

    },
    {
        id: 4,
        title: 'lorem ipsum',
        description: 'SCHOTT is the proud supplier of the world\'s first flexible ultra-thin cover glass for foldable... ',
        image: 'https://picsum.photos/200/300',
        created_at: '2021-07-23T11:02:59.000000Z'

    },
    {
        id: 5,
        title: 'lorem ipsum',
        description: 'SCHOTT is the proud supplier of the world\'s \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n first flexible ultra-thin cover glass for foldable, SCHOTT is the proud supplier of the world\'s first flexible ultra-thin cover glass for foldable, SCHOTT is the proud supplier of the world\'s first flexible ultra-thin cover glass for foldable,  ',
        image: 'https://picsum.photos/200/300',
        created_at: '2021-07-23T11:02:59.000000Z'

    },
    {
        id: 6,
        title: 'lorem ipsum',
        description: 'SCHOTT is the proud supplier of the world\'s first flexible ultra-thin cover glass for foldable... ',
        image: 'https://picsum.photos/200/300',
        created_at: '2021-07-23T11:02:59.000000Z'

    },
    {
        id: 7,
        title: 'lorem ipsum',
        description: 'SCHOTT is the proud supplier of the world\'s \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n first flexible ultra-thin cover glass for foldable, SCHOTT is the proud supplier of the world\'s first flexible ultra-thin cover glass for foldable, SCHOTT is the proud supplier of the world\'s first flexible ultra-thin cover glass for foldable,  ',
        image: 'https://picsum.photos/200/300',
        created_at: '2021-07-23T11:02:59.000000Z'

    },
    {
        id: 8,
        title: 'lorem ipsum',
        description: 'SCHOTT is the proud supplier of the world\'s first flexible ultra-thin cover glass for foldable... ',
        image: 'https://picsum.photos/200/300',
        created_at: '2021-07-23T11:02:59.000000Z'

    },
    {
        id: 9,
        title: 'lorem ipsum',
        description: 'SCHOTT is the proud supplier of the world\'s \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n first flexible ultra-thin cover glass for foldable, SCHOTT is the proud supplier of the world\'s first flexible ultra-thin cover glass for foldable, SCHOTT is the proud supplier of the world\'s first flexible ultra-thin cover glass for foldable,  ',
        image: 'https://picsum.photos/200/300',
        created_at: '2021-07-23T11:02:59.000000Z'

    },
]

export const getCalendarWeek = () => {
    moment.locale('id', momentId)
    let data = []
    let id = 0
    const startMoment = moment('2021-07-13')
    const endMoment =  moment(`${moment().year()+1}-12-31`)
    console.log('start moment', startMoment)
    console.log('end moment', endMoment)
    var addMoment = startMoment
    while (startMoment.isBefore(endMoment)) {
        addMoment = addMoment.add(14, 'days')
        if (addMoment.isAfter(moment())) {
            id += 1
            data.push({
                id: id,
                name: addMoment.format('DD MMMM yyyy')
            })
        }
    }
    // let data = []
    // for (let i=1;i<=53;i++) {
    //     const temp = {
    //         id: i,
    //         name: `${i}`
    //     }
    //     data.push(temp)
    // }

    return data
}

export const dummyCalendar = () => {
    return [
        {
            id: 0,
            date: "18 August 2019",
            day: "Hari Ini",
            start_time: "15:50", 
            end_time: "18:00"
        },
        {
            id: 0,
            day: "Hari Ini",
            date: "18 August 2019",
            start_time: "15:50", 
            end_time: "18:00"
        },
        {
            id: 0,
            day: "Hari Ini",
            date: "18 August 2019",
            start_time: "15:50", 
            end_time: "18:00"
        },
        {
            id: 0,
            day: "Hari Ini",
            date: "18 August 2019",
            start_time: "15:50", 
            end_time: "18:00"
        },
        {
            id: 0,
            day: "Hari Ini",
            date: "18 August 2019",
            start_time: "15:50", 
            end_time: "18:00"
        },
        {
            id: 0,
            day: "Hari Ini",
            date: "18 August 2019",
            start_time: "15:50", 
            end_time: "18:00"
        },
        {
            id: 0,
            day: "Hari Ini",
            date: "18 August 2019",
            start_time: "15:50", 
            end_time: "18:00"
        },

    ]
}