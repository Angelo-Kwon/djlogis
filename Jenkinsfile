node {
  stage('========== Clone repository ==========') {
    checkout scm
  }
  stage('========== Copy Build ==========') {
    sh 'rm -rf ./target'
    sh 'cp -R ../PROJECT_GJ_OP/build/libs ./target'
  }
  stage('========== Build image ==========') {
    app = docker.build("serengeti-user/administrator/gwangju_gj_op")
  }
  stage('========== Push image ==========') {
    docker.withRegistry('https://serengeti.registry:30443', '') {
      app.push("${env.BUILD_NUMBER}")
      app.push("latest")
    }
  }
}