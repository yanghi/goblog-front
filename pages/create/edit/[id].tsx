import { GetServerSidePropsContext } from 'next'
import { postService } from '../../../service/post'
import Edit from '../write'

export async function getServerSideProps(context: GetServerSidePropsContext<{ id: string }>) {

  let params = context.params

  const res = await postService.getPost(Number(params?.id))

  let post = res.data.data

  return { props: { edit: true, editData: post } }
}

export default Edit