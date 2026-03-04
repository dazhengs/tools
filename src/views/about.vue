<template>
  <el-container>
    <el-header>
      <h1>About Us</h1>
    </el-header>
    <el-main>
      <el-card>
        <h2>Our Mission</h2>
        <p>
          We strive to provide the best services to our customers and ensure their satisfaction.
        </p>
      </el-card>
      <el-card>
        <h2>Our Team</h2>
        <p>
          Our team consists of experienced professionals dedicated to achieving excellence.
        </p>
      </el-card>
      <el-card>
        <h2>Contact Us</h2>
        <p>
          For inquiries, please reach out to us.
        </p>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'AboutPage',
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>