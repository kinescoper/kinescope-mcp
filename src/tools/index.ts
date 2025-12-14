/**
 * Все инструменты Kinescope MCP
 * Автоматически сгенерировано на основе Postman коллекции
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { KinescopeClient } from '../client.js';

export interface EndpointMetadata {
  resource: string;
  operation: 'read' | 'write';
  httpMethod: 'get' | 'post' | 'put' | 'patch' | 'delete';
  httpPath: string;
}

export interface Endpoint {
  metadata: EndpointMetadata;
  tool: Tool;
  handler: (client: KinescopeClient, args: any) => Promise<any>;
}

import { toolExport as delete_token } from './access_tokens/_token_id/delete-token.js';
import { toolExport as get_token } from './access_tokens/_token_id/get-token.js';
import { toolExport as create_token } from './access_tokens/create-token.js';
import { toolExport as create_upload_token_to_specific_project } from './access_tokens/create-upload-token-to-specific-project.js';
import { toolExport as tokens_list } from './access_tokens/tokens-list.js';
import { toolExport as delete_additional_material } from './additional_materials/_material_id/delete-additional-material.js';
import { toolExport as get_download_link } from './additional_materials/_material_id/get-download-link.js';
import { toolExport as update_additional_material } from './additional_materials/_material_id/update-additional-material.js';
import { toolExport as reorder_additional_materials } from './additional_materials/reorder/reorder-additional-materials.js';
import { toolExport as custom } from './analytics/custom.js';
import { toolExport as overview } from './analytics/overview/overview.js';
import { toolExport as delete_avatar } from './avatar/delete-avatar.js';
import { toolExport as set_avatar } from './avatar/set-avatar.js';
import { toolExport as usage } from './billing/usage/usage.js';
import { toolExport as create_zone } from './cdn/zones/create-zone.js';
import { toolExport as delete_zone } from './cdn/zones/delete-zone.js';
import { toolExport as get_zones } from './cdn/zones/get-zones.js';
import { toolExport as update_zone } from './cdn/zones/update-zone.js';
import { toolExport as timezones_list } from './dictionaries/timezones/timezones-list.js';
import { toolExport as delete_auth } from './drm/auth/delete-auth.js';
import { toolExport as get_auth } from './drm/auth/get-auth.js';
import { toolExport as update_auth } from './drm/auth/update-auth.js';
import { toolExport as delete_file_request } from './file_requests/_file_request_id/delete-file-request.js';
import { toolExport as get_file_request } from './file_requests/_file_request_id/get-file-request.js';
import { toolExport as update_file_request } from './file_requests/_file_request_id/update-file-request.js';
import { toolExport as create_file_request } from './file_requests/create-file-request.js';
import { toolExport as list_file_requests } from './file_requests/list-file-requests.js';
import { toolExport as chat } from './live/events/chat.js';
import { toolExport as create_event } from './live/events/create-event.js';
import { toolExport as create_restream } from './live/events/create-restream.js';
import { toolExport as delete_event } from './live/events/delete-event.js';
import { toolExport as delete_restream } from './live/events/delete-restream.js';
import { toolExport as enable_event } from './live/events/enable-event.js';
import { toolExport as event_videos } from './live/events/event-videos.js';
import { toolExport as finish_event } from './live/events/finish-event.js';
import { toolExport as get_event } from './live/events/get-event.js';
import { toolExport as get_restream } from './live/events/get-restream.js';
import { toolExport as list_events } from './live/events/list-events.js';
import { toolExport as list_restreams } from './live/events/list-restreams.js';
import { toolExport as move_event } from './live/events/move-event.js';
import { toolExport as qos } from './live/events/qos.js';
import { toolExport as schedule_new_stream } from './live/events/schedule-new-stream.js';
import { toolExport as update_event } from './live/events/update-event.js';
import { toolExport as update_restream } from './live/events/update-restream.js';
import { toolExport as update_schedule_stream } from './live/events/update-schedule-stream.js';
import { toolExport as delete_moderator } from './moderators/_moderator_id/delete-moderator.js';
import { toolExport as get_moderator } from './moderators/_moderator_id/get-moderator.js';
import { toolExport as update_moderator } from './moderators/_moderator_id/update-moderator.js';
import { toolExport as add_moderator } from './moderators/add-moderator.js';
import { toolExport as get_moderators } from './moderators/get-moderators.js';
import { toolExport as delete_logo } from './players/_player_id/delete-logo.js';
import { toolExport as get_player } from './players/_player_id/get-player.js';
import { toolExport as set_logo } from './players/_player_id/set-logo.js';
import { toolExport as update_player } from './players/_player_id/update-player.js';
import { toolExport as create_player } from './players/create-player.js';
import { toolExport as get_players } from './players/get-players.js';
import { toolExport as add_medias } from './playlists/_playlist_id/add-medias.js';
import { toolExport as delete_medias } from './playlists/_playlist_id/delete-medias.js';
import { toolExport as delete_playlist } from './playlists/_playlist_id/delete-playlist.js';
import { toolExport as get_playlist } from './playlists/_playlist_id/get-playlist.js';
import { toolExport as list_medias } from './playlists/_playlist_id/list-medias.js';
import { toolExport as move_media } from './playlists/_playlist_id/move-media.js';
import { toolExport as update_playlist } from './playlists/_playlist_id/update-playlist.js';
import { toolExport as create_playlist } from './playlists/create-playlist.js';
import { toolExport as list_playlists } from './playlists/list-playlists.js';
import { toolExport as upload_poster } from './poster/upload-poster.js';
import { toolExport as delete_domain } from './privacy_domains/_domain_id/delete-domain.js';
import { toolExport as update_domain } from './privacy_domains/_domain_id/update-domain.js';
import { toolExport as create_domain } from './privacy_domains/create-domain.js';
import { toolExport as get_domains } from './privacy_domains/get-domains.js';
import { toolExport as create_folder } from './projects/_project_id/create-folder.js';
import { toolExport as delete_folder } from './projects/_project_id/delete-folder.js';
import { toolExport as delete_project } from './projects/_project_id/delete-project.js';
import { toolExport as folders_list } from './projects/_project_id/folders-list.js';
import { toolExport as get_folder } from './projects/_project_id/get-folder.js';
import { toolExport as get_project } from './projects/_project_id/get-project.js';
import { toolExport as update_folder } from './projects/_project_id/update-folder.js';
import { toolExport as update_project } from './projects/_project_id/update-project.js';
import { toolExport as create_project } from './projects/create-project.js';
import { toolExport as projects_list } from './projects/projects-list.js';
import { toolExport as create_participant } from './speak/rooms/create-participant.js';
import { toolExport as create_room } from './speak/rooms/create-room.js';
import { toolExport as delete_participant } from './speak/rooms/delete-participant.js';
import { toolExport as delete_room } from './speak/rooms/delete-room.js';
import { toolExport as get_participant } from './speak/rooms/get-participant.js';
import { toolExport as get_room } from './speak/rooms/get-room.js';
import { toolExport as list_participants } from './speak/rooms/list-participants.js';
import { toolExport as list_rooms } from './speak/rooms/list-rooms.js';
import { toolExport as update_participant } from './speak/rooms/update-participant.js';
import { toolExport as update_room } from './speak/rooms/update-room.js';
import { toolExport as delete_tag } from './tags/_tag_id/delete-tag.js';
import { toolExport as update_tag } from './tags/_tag_id/update-tag.js';
import { toolExport as create_tag } from './tags/create-tag.js';
import { toolExport as get_tags } from './tags/get-tags.js';
import { toolExport as show_avatar } from './user/avatar/show-avatar.js';
import { toolExport as add_annotation } from './videos/_video_id/add-annotation.js';
import { toolExport as add_subtitle_file } from './videos/_video_id/add-subtitle-file.js';
import { toolExport as concat_video } from './videos/_video_id/concat-video.js';
import { toolExport as copy } from './videos/_video_id/copy.js';
import { toolExport as copy_video } from './videos/_video_id/copy-video.js';
import { toolExport as create_poster_by_time } from './videos/_video_id/create-poster-by-time.js';
import { toolExport as cut_video } from './videos/_video_id/cut-video.js';
import { toolExport as delete_annotation } from './videos/_video_id/delete-annotation.js';
import { toolExport as delete_poster } from './videos/_video_id/delete-poster.js';
import { toolExport as delete_subtitle } from './videos/_video_id/delete-subtitle.js';
import { toolExport as delete_video } from './videos/_video_id/delete-video.js';
import { toolExport as get_annotation } from './videos/_video_id/get-annotation.js';
import { toolExport as get_poster } from './videos/_video_id/get-poster.js';
import { toolExport as get_subtitle } from './videos/_video_id/get-subtitle.js';
import { toolExport as get_video } from './videos/_video_id/get-video.js';
import { toolExport as list_annotations } from './videos/_video_id/list-annotations.js';
import { toolExport as list_subtitles } from './videos/_video_id/list-subtitles.js';
import { toolExport as move_video_to_another_project_and_folder } from './videos/_video_id/move-video-to-another-project-and-folder.js';
import { toolExport as posters_list } from './videos/_video_id/posters-list.js';
import { toolExport as reorder } from './videos/_video_id/reorder.js';
import { toolExport as set_active_poster } from './videos/_video_id/set-active-poster.js';
import { toolExport as update_annotation } from './videos/_video_id/update-annotation.js';
import { toolExport as update_chapters } from './videos/_video_id/update-chapters.js';
import { toolExport as update_subtitle_info } from './videos/_video_id/update-subtitle-info.js';
import { toolExport as update_video } from './videos/_video_id/update-video.js';
import { toolExport as videos_list } from './videos/videos-list.js';
import { toolExport as delete_webhook } from './webhooks/_webhook_id/delete-webhook.js';
import { toolExport as update_webhook } from './webhooks/_webhook_id/update-webhook.js';
import { toolExport as create_webhook } from './webhooks/create-webhook.js';
import { toolExport as list_webhooks } from './webhooks/list-webhooks.js';
import { toolExport as show_avatar_1 } from './workspace/avatar/show-avatar.js';

// Экспорт всех endpoints
export const endpoints = [
  delete_token,
  get_token,
  create_token,
  create_upload_token_to_specific_project,
  tokens_list,
  delete_additional_material,
  get_download_link,
  update_additional_material,
  reorder_additional_materials,
  custom,
  overview,
  delete_avatar,
  set_avatar,
  usage,
  create_zone,
  delete_zone,
  get_zones,
  update_zone,
  timezones_list,
  delete_auth,
  get_auth,
  update_auth,
  delete_file_request,
  get_file_request,
  update_file_request,
  create_file_request,
  list_file_requests,
  chat,
  create_event,
  create_restream,
  delete_event,
  delete_restream,
  enable_event,
  event_videos,
  finish_event,
  get_event,
  get_restream,
  list_events,
  list_restreams,
  move_event,
  qos,
  schedule_new_stream,
  update_event,
  update_restream,
  update_schedule_stream,
  delete_moderator,
  get_moderator,
  update_moderator,
  add_moderator,
  get_moderators,
  delete_logo,
  get_player,
  set_logo,
  update_player,
  create_player,
  get_players,
  add_medias,
  delete_medias,
  delete_playlist,
  get_playlist,
  list_medias,
  move_media,
  update_playlist,
  create_playlist,
  list_playlists,
  upload_poster,
  delete_domain,
  update_domain,
  create_domain,
  get_domains,
  create_folder,
  delete_folder,
  delete_project,
  folders_list,
  get_folder,
  get_project,
  update_folder,
  update_project,
  create_project,
  projects_list,
  create_participant,
  create_room,
  delete_participant,
  delete_room,
  get_participant,
  get_room,
  list_participants,
  list_rooms,
  update_participant,
  update_room,
  delete_tag,
  update_tag,
  create_tag,
  get_tags,
  show_avatar,
  add_annotation,
  add_subtitle_file,
  concat_video,
  copy,
  copy_video,
  create_poster_by_time,
  cut_video,
  delete_annotation,
  delete_poster,
  delete_subtitle,
  delete_video,
  get_annotation,
  get_poster,
  get_subtitle,
  get_video,
  list_annotations,
  list_subtitles,
  move_video_to_another_project_and_folder,
  posters_list,
  reorder,
  set_active_poster,
  update_annotation,
  update_chapters,
  update_subtitle_info,
  update_video,
  videos_list,
  delete_webhook,
  update_webhook,
  create_webhook,
  list_webhooks,
  show_avatar_1,
];
