import Image from 'next/image'
import { useSWRConfig } from 'swr'
import Autolinker from 'autolinker'
import { motion } from 'framer-motion'
import { Account } from '@/types/twitter'
import TwitterIcon from './Icons/TwitterIcon'
import Skeleton from 'react-loading-skeleton'
import { FC, memo, useCallback, useMemo } from 'react'
import { muteAccount, unmuteAccount } from '@/lib/utils'
import { CheckBadgeIcon } from '@heroicons/react/20/solid'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline'
import { TWEET_LINK } from '@/lib/consts'

type Props = {
	isLoading: boolean
	accounts: Account[]
	tab: 'muted' | 'unmuted'
}

const iconVariants = {
	unmuted: {
		d: 'M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z',
	},
	muted: {
		d: 'M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z',
	},
}

const AccountList: FC<Props> = ({ accounts, tab, isLoading }) => {
	if (accounts.length == 0 && !isLoading) {
		return (
			<div className="flex flex-col items-center justify-center px-4 py-4 space-y-10 text-gray-600 dark:text-gray-500 h-full">
				<div className="space-y-4 flex flex-col items-center justify-center">
					{tab === 'unmuted' ? (
						<SpeakerXMarkIcon className="w-10 h-10" />
					) : (
						<SpeakerWaveIcon className="w-10 h-10" />
					)}
					<p className="font-medium">
						{tab === 'unmuted' ? 'You’ve muted all the threadooors.' : 'You haven’t muted anyone yet.'}
					</p>
				</div>
				{tab === 'unmuted' && (
					<>
						<motion.a
							target="_blank"
							href={TWEET_LINK}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="bg-twitter text-white rounded-full py-2 px-4 flex items-center space-x-1"
						>
							<TwitterIcon className="w-6 h-6" />
							<span>Share on Twitter</span>
						</motion.a>
						<p className="text-sm">
							Missed someone?{' '}
							<a
								target="_blank"
								rel="noreferrer"
								className="underline"
								href="https://twitter.com/m1guelpf/status/1564717737548587009"
							>
								Suggest an account
							</a>
							.
						</p>
					</>
				)}
			</div>
		)
	}

	return (
		<ul className="divide-y dark:divide-gray-800 border-b dark:border-gray-800">
			{(isLoading ? [...Array(5)] : accounts).map((account, i) => (
				<AccountCell account={account} tab={tab} key={account?.id_str ?? i} />
			))}
		</ul>
	)
}

const AccountCell: FC<{ account: Account; tab: 'muted' | 'unmuted' }> = memo(({ account, tab }) => {
	const { mutate } = useSWRConfig()

	const toggleMute = useCallback(async () => {
		if (!account) return

		mutate(
			'/api/muted',
			async mutedAccounts => {
				if (tab == 'muted') {
					await unmuteAccount(account)

					return mutedAccounts.filter(id => id != account.id_str)
				}

				await muteAccount(account)
				return mutedAccounts.concat(account.id_str)
			},
			{ revalidate: false }
		)
	}, [account, tab, mutate])

	const accountBio = useMemo<string>(() => {
		if (!account) return

		let bio = account.description

		for (const url of account.entities.description.urls) {
			bio = bio.replace(url.url, url.expanded_url.replace('http://', 'https://'))
		}

		return Autolinker.link(bio, {
			newWindow: true,
			mention: 'twitter',
			hashtag: 'twitter',
			className: 'text-twitter hover:underline',
		})
	}, [account])

	return (
		<li className="py-3 px-3 flex items-center space-x-4">
			<div className="flex-shrink-0">
				{account ? (
					<a href={`https://twitter.com/${account.screen_name}`} target="_blank" rel="noreferrer">
						<Image
							width={40}
							height={40}
							alt={account.name}
							className="rounded-full"
							src={account.profile_image_url_https}
						/>
					</a>
				) : (
					<Skeleton width={40} height={40} circle />
				)}
			</div>
			<div className="flex-1">
				<div className="flex justify-between">
					<div className="flex-1">
						<div className="flex items-center space-x-1">
							<p className="font-medium">{account?.name ?? <Skeleton width={120} />}</p>
							{account?.verified && <CheckBadgeIcon className="w-4 h-4 text-twitter" />}
						</div>
						<div className="-mt-1.5">
							<a
								className="text-gray-500 text-sm hover:underline"
								href={account ? `https://twitter.com/${account.screen_name}` : '#'}
							>
								{account ? `@${account.screen_name}` : <Skeleton width={60} />}
							</a>
						</div>
						{account ? (
							<p className="text-sm mt-1" dangerouslySetInnerHTML={{ __html: accountBio }} />
						) : (
							<div className="mt-1">
								<Skeleton count={2} width={500} />
							</div>
						)}
					</div>
					<div className="flex-shrink-0">
						{account ? (
							<button
								onClick={toggleMute}
								className="bg-twitter hover:bg-red-500 text-white py-2 px-4 font-semibold text-sm rounded-full"
							>
								{tab === 'muted' ? 'Unmute' : 'Mute'}
							</button>
						) : (
							<Skeleton height={30} width={60} />
						)}
					</div>
				</div>
			</div>
		</li>
	)
})
AccountCell.displayName = 'AccountCell'

export default memo(AccountList)