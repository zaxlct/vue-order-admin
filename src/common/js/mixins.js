export const backgroundImage = {
  methods: {
    backgroundImage(url, size = 'contain') {
      return {
        backgroundImage: 'url('+ url +')',
        backgroundSize: size,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }
    }
  },
}
