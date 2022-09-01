import { FC } from 'react'
import { Scroll } from 'scrollex'
import dynamic from 'next/dynamic'
import { signIn } from '@/lib/auth'
import { motion } from 'framer-motion'
import TwitterIcon from '@/components/Icons/TwitterIcon'
const ThemeSwitcher = dynamic(() => import('@/components/ThemeSwitcher'), { ssr: false })
const ThreadCarousel = dynamic(() => import('@/components/RandomThread').then(mod => mod.ThreadCarousel), {
	ssr: false,
})

const Landing: FC = () => (
	<Scroll.Container className="h-screen">
		<Scroll.Section className="h-screen">
			<div className="min-h-screen bg-gray-100 dark:bg-black flex flex-col">
				<ThemeSwitcher className="fixed bottom-3 lg:bottom-auto lg:top-3 right-3 z-30" />
				<div className="flex-1 flex flex-col items-center justify-center -mt-72">
					<ThreadCarousel />
					<ThreadCarousel />
					<ThreadCarousel />
					<ThreadCarousel />
					<ThreadCarousel />
					<motion.div
						initial={{ opacity: 0, background: 'transparent' }}
						animate={{ opacity: 1, background: 'rgba(0, 0, 0, .2)' }}
						transition={{ delay: 0.5, duration: 0.5 }}
						className="absolute inset-0 h-full w-full flex flex-col items-center justify-center z-20 overflow-hidden"
					>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1, duration: 0.5 }}
							className="bg-white/40 dark:bg-black/30 backdrop-filter backdrop-blur-lg backdrop-saturate-150 rounded-xl md:max-w-2xl py-10 mx-2 md:mx-auto md:w-full flex flex-col items-center justify-around px-6 md:px-0"
						>
							<p className="text-3xl md:text-5xl font-bold text-twitter text-center">
								Is this what{' '}
								<TwitterIcon
									aria-label="Twitter logo"
									className="inline w-12 h-12 md:w-16 md:h-16 fill-current stroke-transparent -mt-1"
								/>
								has
								<br /> become?
							</p>
							<div className="my-6 space-y-4 max-w-xl mx-auto">
								<p className="text-lg md:text-2xl text-black/80 dark:text-white/80">
									Twitter is an amazing platform for connecting with others, sharing knowledge and
									making friends. But lately, it’s been co-opted by &quot;growth hackers&quot; trying
									to game the algorithm.
								</p>
								<p className="md:text-xl text-black/60 dark:text-white/60">
									mute.guru lets you take back your feed with a single click. Log in, choose who to
									mute, and go back to scrolling in peace.
								</p>
							</div>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => signIn()}
								className="bg-twitter text-lg text-white rounded-full py-2 px-4 flex items-center space-x-1"
							>
								Get Started
							</motion.button>
						</motion.div>
					</motion.div>
					<ThreadCarousel />
					<ThreadCarousel />
					<ThreadCarousel />
					<ThreadCarousel />
					<ThreadCarousel />
				</div>
			</div>
		</Scroll.Section>
	</Scroll.Container>
)

export default Landing
