document.addEventListener('DOMContentLoaded', async (event) => {
  await faceapi.nets.tinyFaceDetector.loadFromUri('./weights/')
  await faceapi.nets.faceLandmark68Net.loadFromUri('./weights')
  await faceapi.nets.faceRecognitionNet.loadFromUri('./weights')
  await faceapi.nets.faceExpressionNet.loadFromUri('./weights')

  const videoTag = document.getElementById('videoTag')

  videoTag.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(videoTag)
    document.body.append(canvas)
    let displaySize = { width: videoTag.width, height: videoTag.height }
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () => {
      const d = await faceapi.detectAllFaces(videoTag, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

      const resizedDetections = faceapi.resizeResults(d, displaySize)
      canvas.getContext('2d').clearRect(0, 0, videoTag.width, videoTag.height)
      faceapi.draw.drawDetections(canvas, resizedDetections)
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 500)
  })
  videoTag.srcObject = await navigator.mediaDevices.getUserMedia({ video: true })
})
