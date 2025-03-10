<script lang="ts">
	import { mdiGithub, mdiTwitter, mdiLinkedin } from '@mdi/js';
	import { base } from '$app/paths';

	let name = 'Adrián Lorenzo';
	let description = `AI Research and Engineering.
Chief Research Officer @ The Agile Monkeys.
  `;
</script>

<div class="container">
	<img class="image" src="{base}/portrait.jpg" alt="Portrait" />
	<div>
		<div class="header">{name}</div>
		<div class="description">{description}</div>
		<div class="social-links">
			<a href="https://github.com/adrian-lorenzo">
				<svg class="mdi-icon" viewBox="0 0 24 24">
					<path d={mdiGithub} />
				</svg>
			</a>
			<a href="https://twitter.com/xAdrianLorenzo">
				<svg class="mdi-icon" viewBox="0 0 24 24">
					<path d={mdiTwitter} />
				</svg>
			</a>
			<a href="https://linkedin.com/in/adrian-lorenzo-melian">
				<svg class="mdi-icon" viewBox="0 0 24 24">
					<path d={mdiLinkedin} />
				</svg>
			</a>
		</div>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css?family=Merriweather:400,700&display=swap');

	.container {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
		padding: 20px;
		box-sizing: border-box;
	}

	.image {
		width: 100%;
		max-width: 250px;
		height: auto;
		box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
		border-radius: 50%;
		object-fit: cover;
		margin-right: 0;
		margin-bottom: 20px;
	}

	.header {
		font-size: 28px;
		font-weight: bold;
		margin-bottom: 10px;
		text-align: left;
		font-family: 'Merriweather', serif;
	}

	.description {
		font-size: 16px;
		line-height: 1.5;
		color: #333;
		text-align: left;
		white-space: pre-wrap;
		font-family: 'Merriweather', serif;
	}

	.social-links {
		display: flex;
		justify-content: left;
		align-items: center;
	}

	.social-links a {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 10px;
	}

	.social-links svg {
		width: 20px;
		height: 20px;
	}

	:body {
		background: #ebebeb;
		margin: 0;
		font-size: 16px;
		line-height: 1.5;
		font-family: 'Merriweather', serif;
	}

	@media screen and (min-width: 768px) {
		.container {
			flex-direction: row;
		}

		.image {
			margin-right: 60px;
			margin-bottom: 0;
		}
	}
</style>
